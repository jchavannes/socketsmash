## Build
```sh
VERSION="0.2"
REGISTRY="host.docker.internal:5000"

# Build image
docker-compose --profile prod build

# Tag images
NAME_HTTP="${REGISTRY}/socketsmash-http"
NAME_WS="${REGISTRY}/socketsmash-ws"

docker tag socketsmash-http-prod ${NAME_HTTP}:${VERSION}
docker tag ${NAME_HTTP}:${VERSION} ${NAME_HTTP}:latest

docker tag socketsmash-ws-prod ${NAME_WS}:${VERSION}
docker tag ${NAME_WS}:${VERSION} ${NAME_WS}:latest

# Push image to registry
docker push ${NAME_HTTP}:${VERSION}
docker push ${NAME_HTTP}:latest

docker push ${NAME_WS}:${VERSION}
docker push ${NAME_WS}:latest
```

#### Run build
```sh
docker run -d --name socketsmash-http --restart unless-stopped -p 8235:80 host.docker.internal:5000/socketsmash-http:latest
docker run -d --name socketsmash-ws   --restart unless-stopped -p 8236:80 host.docker.internal:5000/socketsmash-ws:latest
```
