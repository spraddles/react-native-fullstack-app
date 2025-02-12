#  Note:
#  This is a just list of gcloud commands for GCP so
#  this file is not meant to be executed anywhere.
#  Instead run each command one by one to setup the 
#  GCP resources. This file could be converted to an 
#  IaC (like Terraform) with some more effort.

##############################  INITIAL SETUP  ##############################

PROJECT_ID='your-project-id'

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

##############################  SERVICE ACCOUNT ##############################

SERVICE_ACCOUNT="github-actions-service-account"
SERVICE_ACCOUNT_FULL="github-actions-service-account@$PROJECT_ID.iam.gserviceaccount.com"
SERVICE_ACCOUNT_DISPLAY_NAME='Github Actions Service Account'

# create Service Account
gcloud iam service-accounts create $SERVICE_ACCOUNT \
    --project=$PROJECT_ID \
    --display-name=$SERVICE_ACCOUNT_DISPLAY_NAME

##############################  LOAD BALANCER  ##############################

REGION='northamerica-northeast1'
SERVICE_NAME='your-service-name'
DOMAIN='app.website.com'

# ** Note: **
# the SERVICE_NAME needs to match the name of the
# service that you define in your deploy YAML file:
# e.g. gcloud run deploy SERVICE_NAME

# create network endpoint group (NEG)
gcloud compute network-endpoint-groups create lb-neg \
    --region=$REGION \
    --network-endpoint-type=serverless \
    --cloud-run-service=$SERVICE_NAME \
    --project=$PROJECT_ID

# create backend service:
# use HTTP if load balancer + service is within the
# same provider. If not use HTTPS
gcloud compute backend-services create lb-backend \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED \
    --protocol=HTTP \
    --project=$PROJECT_ID

# add NEG to backend
gcloud compute backend-services add-backend lb-backend \
    --global \
    --network-endpoint-group=lb-neg \
    --network-endpoint-group-region=$REGION \
    --project=$PROJECT_ID

# create URL map
gcloud compute url-maps create lb-url-map \
    --default-service lb-backend \
    --global \
    --project=$PROJECT_ID

# create static IP
gcloud compute addresses create lb-static-ip \
    --network-tier=PREMIUM \
    --global \
    --ip-version=IPV4 \
    --project=$PROJECT_ID

# create SSL certificate
gcloud compute ssl-certificates create lb-cert \
    --domains=$DOMAIN \
    --global \
    --project=$PROJECT_ID

# create HTTP proxy
gcloud compute target-http-proxies create lb-http-proxy \
    --url-map=lb-url-map \
    --ssl-certificates=lb-cert \
    --global \
    --project=$PROJECT_ID

# create forwarding rule
gcloud compute forwarding-rules create lb-forwarding-rule \
   --target-http-proxy=lb-http-proxy \
   --global \
   --ports=443 \
   --address=lb-static-ip \
   --load-balancing-scheme=EXTERNAL_MANAGED \
   --network-tier=PREMIUM \
   --project=$PROJECT_ID

# get IP address & add to cloudflare config
LB_IP_ADDRESS=gcloud compute addresses describe lb-static-ip --global --project=$PROJECT_ID --format="value(address)"

##############################  WORKLOAD IDENTITY  ##############################

POOL_NAME="github-pool"
POOL_DISPLAY_NAME='Github Actions Pool'
PROVIDER_NAME="github-provider"
PROVIDER_DISPLAY_NAME="Github Actions Provider"
GITHUB_REPO="your-org/your-repo"

# create Workload Identity Pool
gcloud iam workload-identity-pools create $POOL_NAME \
    --project=$PROJECT_ID \
    --location="global" \
    --display-name=$POOL_DISPLAY_NAME

# create Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
    --project=$PROJECT_ID \
    --location="global" \
    --workload-identity-pool=$POOL_NAME\
    --display-name=$PROVIDER_DISPLAY_NAME \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
    --attribute-condition="attribute.repository == '$GITHUB_REPO'" \
    --issuer-uri="https://token.actions.githubusercontent.com"

# get pool name
WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe $POOL_NAME \
    --project=$PROJECT_ID \
    --location="global" \
    --format="value(name)")

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
    --description="Docker repository" \
    --project=$PROJECT_ID

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

##############################  PERMISSIONS  ##############################

# project: add IAM policy
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_FULL" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_FULL" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_FULL" \
    --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_FULL" \
    --role="roles/secretmanager.viewer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_FULL" \
    --role="roles/run.admin"

# service: add IAM policy
gcloud run services add-iam-policy-binding express \
    --member="serviceAccount:github-actions-service-account@gringopay-2025.iam.gserviceaccount.com" \
    --role="roles/run.invoker" \
    --region=southamerica-east1 \
    --project=gringopay-2025

# service account: add IAM policy
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_FULL" \
    --role=roles/run.invoker

# artifact: add IAM policy
gcloud artifacts repositories add-iam-policy-binding $ARTIFACT_REPO_NAME \
    --location=$REGION \
    --member="serviceAccount:$SERVICE_ACCOUNT_FULL" \
    --role="roles/artifactregistry.writer"

# workload identity: add IAM policy
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT_FULL \
    --project=$PROJECT_ID \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/$WORKLOAD_IDENTITY_POOL_ID/attribute.repository/$GITHUB_REPO"

##############################  DOCKER  ##############################

# configure Docker auth
gcloud auth configure-docker $REGION-docker.pkg.dev
