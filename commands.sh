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
AKS_CLUSTER_NAME=aksworkshop-$RANDOM
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
ACR_NAME=acr$RANDOM

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
cd ~

# Clone, build ratings-web image and push to ACR
cd airbnb-clone/airbnb-web
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-web:v1 .
cd ~

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
# PART 4: Deploy API to AKS Cluster
# ====================================

# create the deployment through ratings-api-deployment.yaml file 
kubectl apply --namespace $NAMESPACE -f airbnb-hotel-deployment.yaml

# see the pods roll out
kubectl get pods --namespace $NAMESPACE -l app=airbnb-hotel -w

# read the file ratings-api-service.yaml and see that the container ports 3000 are exposed with port 80 to be reachable from inside the cluster  
# expose the ratings-api through a ClusterIP service
# once deployment is done, service uses the name to add the port of deployment to load balancer
kubectl apply --namespace $NAMESPACE -f airbnb-hotel-service.yaml

# check the service installation 
kubectl get service airbnb-hotel --namespace $NAMESPACE
kubectl get endpoints airbnb-hotel --namespace $NAMESPACE

# ================================================
# PART 5: Deploying front-end API to AKS Cluster
# ================================================

kubectl apply --namespace $NAMESPACE -f airbnb-web-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-web-service.yaml

kubectl get pods --namespace $NAMESPACE -l app=airbnb-web 
kubectl get deploy --namespace $NAMESPACE -l app=airbnb-web 

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
ACR_URL=acr23785.azurecr.io

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

# Apply ingress file
cd airbnb-clone
kubectl apply -f airbnb-ingress.yaml --namespace $NAMESPACE

# Check and get URL
kubectl get ingress --all-namespaces

# ===========================================================
# PART CURSED: Configure K8 Ingress controller using NGINX
# ===========================================================

# create the nginx-ingress namespace  
kubectl create namespace ingress

# add the "stable" repo 
helm repo add stable https://kubernetes-charts.storage.googleapis.com/

# check the repo 
helm search repo stable
# ---> list all charts stable provide
# in the following command we deploy the nginx-ingress using the nginx-ingress chart, set the replica count to 2 for redundancy
# set the nodeselector to linux to schedue the ingress controller only on linux nodes
helm install nginx-ingress stable/nginx-ingress \
    --namespace ingress \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux

# check the nginx-ingress deployment
kubectl get service nginx-ingress-controller --namespace ingress 

# ---> notice here that the EXTERNAL IP is given a Public IP it means that the service type is set to "LoadBalancer"
# EXTERNAL IP OBTAINED IS:
# NAME                       TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)                      AGE
# nginx-ingress-controller   LoadBalancer   10.2.0.154  20.70.16.36   80:30890/TCP,443:31465/TCP   37s

# IF THE WEB SERVICE WAS CREATED WITH LoadBalancer..
kubectl delete service --namespace $NAMESPACE ratings-web
kubectl apply --namespace ingress -f ratings-web-ingress.yaml

# create the ingress in "ratingsapp" namespace 
kubectl apply --namespace $NAMESPACE -f ratings-web-ingress.yaml
# ---> in the 'rules' field we match the ingress controller with backend that is the frontend, thus, it will send http requests to the ratings-web 

# ingress.networking.k8s.io/ratings-web-ingress created
# FINALLY: Ingress url: frontend.20-70-16-36.nip.io

# TO RESET AND TRY AGAIN
kubectl delete ingress --namespace $NAMESPACE ratings-web-ingress
kubectl apply --namespace $NAMESPACE -f ratings-web-ingress.yaml

# the web app is now reachable via the browser through "http://frontend.13-68-177-68.nip.io" set your EXTERNAL IP address resulted in the last command 
# (C) 2022 GitHub, Inc.