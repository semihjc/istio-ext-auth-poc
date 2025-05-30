# Istio external authorization poc

### Prerequisites 

1. In Docker Desktop enable k8s one node cluster `Settigns/Kubernetes/Enable Kubernetes`
2. Checkout istio tets branch `istio-test-poc` on repo `https://github.com/TheJumpCloud/jumpcloud-ingress-authn/`
3. Build ingress-authn service image for deploying local k8s cluster like ` docker build -t test-ingress:0.2 .`

## Deploy Istio gateway

Install and deploy istio with sidecar enabled
```
brew install istioctl
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
```

## Deploy authn and example service to local

 Apply mongo.yaml and authn.yaml and httpbin.yaml
 ```
 kubectl apply -f authn.yaml
 kubectl apply -f mongo.yaml
 kubectl apply -f httpbin.yaml
 ```
## Add entry for api-key into mongo db
exec into mongo db and run script `add-api-key.js` in mongosh shell

 ## Apply gateway routing and authorization policy

 ```
kubectl apply -f gateway.yaml
kubectl apply -f virtual-service.yaml
kubectl apply -f authorization-policy.yaml
 ```

 ## Edit istio mesh config
 Copy istio-config-map-change.yaml content and edit istio mesh config with `kubectl edit configmap istio -n istio-system`

## Add port forwarding for curl requests
```
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
```
## Test with curl 

```
curl  http://localhost:8080/headers
# this url should ideally get 200 because we have api key in the headers.
curl -H "x-api-key: valid-api-key" http://localhost:8080/headers
```