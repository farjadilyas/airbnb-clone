# ==========================
# UPDATED CODE PIPELINE
# ==========================

git add .
git commit --amend --no-edit
git push origin main --force-with-lease

cd ..
rm -rf -d airbnb-clone
git clone https://github.com/farjadilyas/airbnb-clone

# Build and push image to container registry using dockerfile
cd airbnb-clone/airbnb-hotel
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-hotel:v1 .
cd ..

# Clone, build ratings-web image and push to ACR
cd airbnb-web
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-web:v1 .
cd ..

# Might have to delete services and pods..



# Apply deployment and service code for each image
kubectl delete -f airbnb-hotel --namespace $NAMESPACE
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-hotel-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-hotel-service.yaml
kubectl delete -f airbnb-web --namespace $NAMESPACE
kubectl apply --namespace $NAMESPACE -f airbnb-web/airbnb-web-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-web/airbnb-web-service.yaml


# IF ingress updated..
kubectl delete ingress airbnb-ingress --namespace $NAMESPACE
kubectl apply -f airbnb-ingress.yaml --namespace $NAMESPACE