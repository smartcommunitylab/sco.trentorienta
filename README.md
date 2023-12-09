# sco.trentorienta
TrentOrienta applicaction backend

## Build/Run Java

mvn clean package -Dmaven.test.skip=true
java -Dserver.contextPath=/trentorienta -Dserver.port=7016 -jar target/trentorientaService-1.0.0.jar

## Docker

Build image
``
docker build -t smartcommunitylab/trentorienta Dockerfile .
``

Run image
``
docker run -p 8080:8080 smartcommunitylab/trentorienta
``

Docker compose 
``
docker-compose up
``

## Variables
Set environment variables to run the applications. Apart from standard Spring properties, the app may require (if not from docker compose)
- `MONGO_HOST` Mongo Host service
- `MONGO_PORT` Mongo Port
- `MONGO_DB` name of the Database to use