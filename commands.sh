# ===============================================
# PRE-FLIGHT
# ===============================================

# Delete EVERYTHING in kubernetes
kubectl delete all --all --all-namespaces

# ===============================================
# PART 1: Creating AKS Clusters
# ===============================================

# Need these arguments in the BASH
REGION_NAME=australiacentral
RESOURCE_GROUP=aksworkshop
SUBNET_NAME=aks-subnet
VNET_NAME=aks-vnet

# Creating the resource group
az group create --name=$RESOURCE_GROUP --location=$REGION_NAME

# Creating the network
az network vnet create \
    --resource-group $RESOURCE_GROUP \
    --location $REGION_NAME \
    --name $VNET_NAME \
    --address-prefixes 10.0.0.0/8 \
    --subnet-name $SUBNET_NAME \
    --subnet-prefixes 10.240.0.0/16

# Finding the Subnet ID
SUBNET_ID=$(az network vnet subnet show \
    --resource-group $RESOURCE_GROUP \
    --vnet-name $VNET_NAME \
    --name $SUBNET_NAME \
    --query id -o tsv)
echo $SUBNET_ID

# Getting the right version of Kubernetes
VERSION=$(az aks get-versions \
    --location $REGION_NAME \
    --query 'orchestrators[?!isPreview] | [-1].orchestratorVersion' \
    --output tsv)
echo $VERSION

# Creating Cluster Name
AKS_CLUSTER_NAME=aksworkshop-2598
echo $AKS_CLUSTER_NAME

# Creating the Cluster
az aks create \
    --resource-group $RESOURCE_GROUP \
    --name $AKS_CLUSTER_NAME \
    --vm-set-type VirtualMachineScaleSets \
    --node-count 2 \
    --load-balancer-sku standard \
    --location $REGION_NAME \
    --kubernetes-version $VERSION \
    --network-plugin azure \
    --vnet-subnet-id $SUBNET_ID \
    --service-cidr 10.2.0.0/24 \
    --dns-service-ip 10.2.0.10 \
    --docker-bridge-address 172.17.0.1/16 \
    --generate-ssh-keys \
    --node-vm-size standard_b2ms

# Set the AKS created as the current context
az aks get-credentials \
    --resource-group $RESOURCE_GROUP \
    --name $AKS_CLUSTER_NAME

# Get the nodes of the nodes that make up the AKS cluster
kubectl get nodes

# Create Kubernetes namespace for this application
# A logical boundary, exactly what it sounds like
NAMESPACE=airbnb
kubectl create namespace $NAMESPACE
kubectl get namespace

# ===============================================
# PART 2: Create ACR
# ===============================================

# Create randomized ACR name
ACR_NAME=acr23996

# Create registry
az acr create \
    --resource-group $RESOURCE_GROUP \
    --location $REGION_NAME \
    --name $ACR_NAME \
    --sku Standard

# Cloning Repository
git clone https://github.com/farjadilyas/airbnb-clone

# Build and push image to container registry using dockerfile
cd airbnb-clone/airbnb-hotel
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-hotel:v1 .
cd ..

cd airbnb-clone/airbnb-booking
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-booking:v1 .
cd ..

cd airbnb-clone/airbnb-payment
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-payment:v1 .
cd ..

cd airbnb-clone/airbnb-user
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-user:v1 .
cd ..

cd airbnb-web
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-web:v1 .
cd ..

# Check images in repo
az acr repository list --name $ACR_NAME --output table

# Configure AKS cluster to authenticate to ACR
az aks update \
    --name $AKS_CLUSTER_NAME \
    --resource-group $RESOURCE_GROUP \
    --attach-acr $ACR_NAME

# ==========================================
# PART 3: Deploy MongoDB to AKS using Helm
# ==========================================

# Download repo of charts
helm repo add bitnami https://charts.bitnami.com/bitnami

# Get a list of available charts
# Helm chart is a collection of files that describe a related set of kubernetes resources
helm search repo bitnami

# Install a chart
helm install ratings bitnami/mongodb --namespace $NAMESPACE --set auth.username=cloud,auth.password=cloud,auth.database=ratingsdb

# Save db user pass in kubernetes secret to avoid leaks
kubectl create secret generic dbsecret \
    --namespace $NAMESPACE \
    --from-literal=MONGOCONNECTION="mongodb://cloud:cloud@ratings-mongodb.ratingsapp:27017/ratingsdb"

# Name of mongodb service - ratings-mongodb.ratingsapp.svc.cluster.local

# ====================================
# PART 4: Deploy all microservices to AKS Cluster
# ====================================

# create the deployments through <microservice-name>-deployment.yaml files 
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-hotel-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-hotel-service.yaml

kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-booking-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-booking-service.yaml

kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-payment-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-payment -service.yaml

kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-user-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-user-service.yaml

kubectl apply --namespace $NAMESPACE -f airbnb-web/airbnb-web-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-web/airbnb-web-service.yaml

kubectl get pods --namespace $NAMESPACE
kubectl get deploy --namespace $NAMESPACE

kubectl get service airbnb-web --namespace $NAMESPACE
kubectl get endpoints airbnb-web --namespace $NAMESPACE

# =======================================================
# PART 6: Deploying the Ingress Controller
# =======================================================

# !!! CONFIRM THE REGISTRY NAME
REGISTRY_NAME=$ACR_NAME
SOURCE_REGISTRY=k8s.gcr.io
CONTROLLER_IMAGE=ingress-nginx/controller
CONTROLLER_TAG=v1.0.4
PATCH_IMAGE=ingress-nginx/kube-webhook-certgen
PATCH_TAG=v1.1.1
DEFAULTBACKEND_IMAGE=defaultbackend-amd64
DEFAULTBACKEND_TAG=1.5

az acr import --name $REGISTRY_NAME --source $SOURCE_REGISTRY/$CONTROLLER_IMAGE:$CONTROLLER_TAG --image $CONTROLLER_IMAGE:$CONTROLLER_TAG
az acr import --name $REGISTRY_NAME --source $SOURCE_REGISTRY/$PATCH_IMAGE:$PATCH_TAG --image $PATCH_IMAGE:$PATCH_TAG
az acr import --name $REGISTRY_NAME --source $SOURCE_REGISTRY/$DEFAULTBACKEND_IMAGE:$DEFAULTBACKEND_TAG --image $DEFAULTBACKEND_IMAGE:$DEFAULTBACKEND_TAG

# Add the ingress-nginx repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# Set variable for ACR location to use for pulling images
ACR_URL=$ACR_NAME.azurecr.io

# Use Helm to deploy an NGINX ingress controller
helm install nginx-ingress ingress-nginx/ingress-nginx \
    --version 4.0.13 \
    --namespace $NAMESPACE \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."kubernetes\.io/os"=linux \
    --set controller.image.registry=$ACR_URL \
    --set controller.image.image=$CONTROLLER_IMAGE \
    --set controller.image.tag=$CONTROLLER_TAG \
    --set controller.image.digest="" \
    --set controller.admissionWebhooks.patch.nodeSelector."kubernetes\.io/os"=linux \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
    --set controller.admissionWebhooks.patch.image.registry=$ACR_URL \
    --set controller.admissionWebhooks.patch.image.image=$PATCH_IMAGE \
    --set controller.admissionWebhooks.patch.image.tag=$PATCH_TAG \
    --set controller.admissionWebhooks.patch.image.digest="" \
    --set defaultBackend.nodeSelector."kubernetes\.io/os"=linux \
    --set defaultBackend.image.registry=$ACR_URL \
    --set defaultBackend.image.image=$DEFAULTBACKEND_IMAGE \
    --set defaultBackend.image.tag=$DEFAULTBACKEND_TAG \
    --set defaultBackend.image.digest=""

# Check Ingress Service
kubectl --namespace $NAMESPACE get services -o wide -w nginx-ingress-ingress-nginx-controller

# !!! EXTERNAL IP HERE: <EXTERNAL_IP>


## ENSURE APPLY THE CONTAINER'S SERVICE & DEPLOYMENT YAML FILES

# !!! ENSURE REPLACE EXTERNAL IP IN INGRESS

# Apply ingress file
kubectl apply -f airbnb-ingress.yaml --namespace $NAMESPACE

# Check and get URL
kubectl get ingress --all-namespaces
