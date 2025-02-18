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
    networksecurity.googleapis.com \
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
    --network-endpoint-type="serverless" \
    --cloud-run-service=$SERVICE_NAME \
    --project=$PROJECT_ID

# create backend service:
gcloud compute backend-services create lb-backend \
    --global \
    --load-balancing-scheme="EXTERNAL_MANAGED" \
    --project=$PROJECT_ID

# add NEG to backend
gcloud compute backend-services add-backend lb-backend \
    --global \
    --network-endpoint-group="lb-neg" \
    --network-endpoint-group-region=$REGION \
    --project=$PROJECT_ID

# create URL map
gcloud compute url-maps create lb-url-map \
    --default-service="lb-backend" \
    --global \
    --project=$PROJECT_ID

# create static IP
gcloud compute addresses create lb-static-ip \
    --network-tier="PREMIUM" \
    --global \
    --ip-version="IPV4" \
    --project=$PROJECT_ID

# create SSL certificate
gcloud compute ssl-certificates create lb-cert \
    --domains=$DOMAIN \
    --global \
    --project=$PROJECT_ID

# create HTTPS proxy
gcloud compute target-https-proxies create lb-https-proxy \
    --url-map="lb-url-map" \
    --ssl-certificates="lb-cert" \
    --global \
    --project=$PROJECT_ID

# create forwarding rule
gcloud compute forwarding-rules create lb-forwarding-rule \
   --target-https-proxy="lb-https-proxy" \
   --global \
   --ports="443" \
   --address="lb-static-ip" \
   --load-balancing-scheme="EXTERNAL_MANAGED" \
   --network-tier="PREMIUM" \
   --project=$PROJECT_ID

# get IP address & add to cloudflare config
LB_IP_ADDRESS=$(gcloud compute addresses describe lb-static-ip --global --project=$PROJECT_ID --format="value(address)")

##############################  CLOUD ARMOUR RULES  ##############################

# Cloudflare get IPv4 ranges 
URL="https://www.cloudflare.com/ips-v4" \
IP_LIST=$(curl -s "$URL") \
IP_ARRAY=(${(f)IP_LIST}) \
IP_V4_LIST_FORMATTED_1=$(IFS=,; echo "$IP_ARRAY[1,10]") \
IP_V4_LIST_FORMATTED_2=$(IFS=,; echo "$IP_ARRAY[11,-1]")

# Cloudflare get IPv6 ranges 
URL_IPV6="https://www.cloudflare.com/ips-v6" \
IP_V6_LIST=$(curl -s "$URL_IPV6") \
IP_V6_LIST_FORMATTED=$(echo "$IP_V6_LIST" | tr '\n' ',') \
IP_V6_LIST_FORMATTED=${IP_V6_LIST_FORMATTED%,}

gcloud compute security-policies create allow-cloudflare-ranges \
    --description "Allow Cloudflare IP ranges"

gcloud compute security-policies rules create 1000 \
    --security-policy="allow-cloudflare-ranges" \
    --description="Allow Cloudflare IPv4 ranges" \
    --src-ip-ranges="$IP_V4_LIST_FORMATTED_1" \
    --action="allow"

gcloud compute security-policies rules create 2000 \
    --security-policy="allow-cloudflare-ranges" \
    --description="Allow Cloudflare IPv4 ranges" \
    --src-ip-ranges="$IP_V4_LIST_FORMATTED_2" \
    --action="allow"

gcloud compute security-policies rules create 3000 \
    --security-policy="allow-cloudflare-ranges" \
    --description="Allow Cloudflare IPv6 ranges" \
    --src-ip-ranges="$IP_V6_LIST_FORMATTED" \
    --action="allow"

gcloud compute security-policies rules update 2147483647 \
    --security-policy="allow-cloudflare-ranges" \
    --action="deny-404"

gcloud compute backend-services update lb-backend \
    --security-policy="allow-cloudflare-ranges" \
    --global

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

##############################  OAUTH CLIENT  ##############################

# Steps:
# 1) go to GCP console > API + Services > Credentials > Create > Oauth
# 2) enter in the details from the expo app.config.ts file
# 3) copy client ID from google & add to ENV file
# 4) copy client ID from google & add to Supabase > Auth > Google
# 5) go to GCP Auth platform > Setup: audience, brand, testing/prod, internal/external users etc.

##############################  ARTIFACTS  ##############################

ARTIFACT_REPO_NAME="my-docker-repo"

# create Docker repository
gcloud artifacts repositories create $ARTIFACT_REPO_NAME \
    --repository-format="docker" \
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

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_FULL" \
    --role="roles/run.invoker"

# service: add IAM policy
gcloud run services add-iam-policy-binding $SERVICE_NAME \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region=$REGION

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
