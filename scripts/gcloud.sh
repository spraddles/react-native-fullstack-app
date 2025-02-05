#  Note:
#  This is a just list of gcloud commands for GCP so
#  this file is not meant to be executed anywhere.
#  Instead run each command one by one to setup the 
#  GCP resources. This file could be converted to an 
#  IaC (like Terraform) with some more effort.

##############################  INITIAL SETUP  ##############################

PROJECT_ID='your-project-id'
REGION='northamerica-northeast1'
SERVICE_NAME='your-service-name'

# login
gcloud auth login

# set project
gcloud config set project $PROJECT_ID

# enable api's
gcloud services enable \
    compute.googleapis.com \
    secretmanager.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudresourcemanager.googleapis.com \
    iam.googleapis.com \
    containerregistry.googleapis.com

##############################  LOAD BALANCER  ##############################

# create network endpoint group (NEG)
gcloud compute network-endpoint-groups create lb-neg \
    --region=$REGION \
    --network-endpoint-type=serverless \
    --cloud-run-service=$SERVICE_NAME

# create backend service
gcloud compute backend-services create lb-backend \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED \
    --protocol=HTTP

# add NEG to backend
gcloud compute backend-services add-backend lb-backend \
    --global \
    --network-endpoint-group=lb-neg \
    --network-endpoint-group-region=$REGION

# create URL map
gcloud compute url-maps create lb-url-map \
    --default-service lb-backend \
    --global

# create HTTP proxy
gcloud compute target-http-proxies create lb-http-proxy \
    --url-map=lb-url-map \
    --global

# create forwarding rule
gcloud compute forwarding-rules create lb-forwarding-rule \
    --load-balancing-scheme=EXTERNAL_MANAGED \
    --target-http-proxy=lb-http-proxy \
    --global \
    --ports=80

##############################  WORKLOAD IDENTITY  ##############################

POOL_NAME="github-pool"
POOL_DISPLAY_NAME='Github Actions Pool'
PROVIDER_NAME="github-provider"
PROVIDER_DISPLAY_NAME="Github Actions Provider"
SERVICE_ACCOUNT_NAME="github-actions-service-account"
SERVICE_ACCOUNT_DISPLAY_NAME='Github Actions Service Account'
GITHUB_REPO="your-org/your-repo"

# create Workload Identity Pool
gcloud iam workload-identity-pools create $POOL_NAME \
  --project=$PROJECT_ID \
  --location="global" \
  --display-name=$POOL_DISPLAY_NAME

# create Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc github-provider \
    --project=$PROJECT_ID \
    --location="global" \
    --workload-identity-pool=$POOL_NAME\
    --display-name=$PROVIDER_DISPLAY_NAME \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
    --attribute-condition="attribute.repository == '$GITHUB_REPO'" \
    --issuer-uri="https://token.actions.githubusercontent.com"

##############################  SERVICE ACCOUNT ##############################

# create Service Account
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --project=$PROJECT_ID \
  --display-name=$SERVICE_ACCOUNT_DISPLAY_NAME

# get pool name
WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe $POOL_NAME \
  --project=$PROJECT_ID \
  --location="global" \
  --format="value(name)")

# add IAM Policy Binding
gcloud iam service-accounts add-iam-policy-binding "$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --project=$PROJECT_ID \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/$WORKLOAD_IDENTITY_POOL_ID/attribute.repository/$GITHUB_REPO"

# ** Note: **
# Be aware of how you set the repo value:
# WRONG:   principalSet://iam.googleapis.com/projects/123456/locations/global/workloadIdentityPools/github-pool/attribute.repository/https://github.com/repo-owner/repo-name
# CORRECT: principalSet://iam.googleapis.com/projects/123456/locations/global/workloadIdentityPools/github-pool/attribute.repository/repo-owner/repo-name

##############################  ARTIFACTS  ##############################

ARTIFACT_REPO_NAME="my-docker-repo"

# create Docker repository
gcloud artifacts repositories create $ARTIFACT_REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository"

# set cleanup policy
gcloud artifacts repositories set-cleanup-policies $ARTIFACT_REPO_NAME \
    --project=$PROJECT_ID \
    --location=$REGION \
    --policy=- <<EOF
[{  "name": "delete-old-artifacts",
    "action": {"type": "Delete"},
    "condition": {
      "olderThan": "20d"
}}]
EOF

# grant permissions to service account
gcloud artifacts repositories add-iam-policy-binding $ARTIFACT_REPO_NAME \
    --location=$REGION \
    --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

# add IAM policies
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME" \
  --role="roles/artifactregistry.writer" \

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME" \
  --role="roles/secretmanager.viewer"

# configure Docker auth
gcloud auth configure-docker $REGION-docker.pkg.dev

