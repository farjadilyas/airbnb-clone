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

cd airbnb-booking
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-booking:v1 .
cd ..

cd airbnb-payment
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-payment:v1 .
cd ..

cd airbnb-user
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-user:v1 .
cd ..

# Clone, build ratings-web image and push to ACR
cd airbnb-web
az acr build \
    --resource-group $RESOURCE_GROUP \
    --registry $ACR_NAME \
    --image airbnb-web:v1 .
cd ..


# Apply deployment and service code for each image
kubectl delete -f airbnb-hotel --namespace $NAMESPACE
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-hotel-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-hotel/airbnb-hotel-service.yaml

kubectl delete -f airbnb-booking --namespace $NAMESPACE
kubectl apply --namespace $NAMESPACE -f airbnb-booking/airbnb-booking-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-booking/airbnb-booking-service.yaml

kubectl delete -f airbnb-payment --namespace $NAMESPACE
kubectl apply --namespace $NAMESPACE -f airbnb-payment/airbnb-payment-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-payment/airbnb-payment-service.yaml

kubectl delete -f airbnb-user --namespace $NAMESPACE
kubectl apply --namespace $NAMESPACE -f airbnb-user/airbnb-user-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-user/airbnb-user-service.yaml

kubectl delete -f airbnb-web --namespace $NAMESPACE
kubectl apply --namespace $NAMESPACE -f airbnb-web/airbnb-web-deployment.yaml
kubectl apply --namespace $NAMESPACE -f airbnb-web/airbnb-web-service.yaml


# IF ingress updated..
kubectl delete ingress airbnb-ingress --namespace $NAMESPACE
kubectl apply -f airbnb-ingress.yaml --namespace $NAMESPACE
