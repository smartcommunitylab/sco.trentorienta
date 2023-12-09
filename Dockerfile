FROM maven:3.3.3-jdk-8 AS mvn
WORKDIR /tmp
COPY ./pom.xml /tmp/trentorienta/pom.xml
COPY ./src /tmp/trentorienta/src
WORKDIR /tmp/trentorienta
RUN mvn clean install -Dmaven.test.skip=true

FROM openjdk:8-jdk-alpine
ENV FOLDER=/tmp/trentorienta/target
ENV APP=trentorientaService-1.0.0.jar
ARG USER=trentorienta
ARG USER_ID=3004
ARG USER_GROUP=trentorienta
ARG USER_GROUP_ID=3004
ARG USER_HOME=/home/${USER}

RUN  addgroup -g ${USER_GROUP_ID} ${USER_GROUP}; \
     adduser -u ${USER_ID} -D -g '' -h ${USER_HOME} -G ${USER_GROUP} ${USER} ;

WORKDIR  /home/${USER}/app
RUN chown ${USER}:${USER_GROUP} /home/${USER}/app
COPY --from=mvn --chown=trentorienta:trentorienta ${FOLDER}/${APP} /home/${USER}/app/trentorientaService.jar

USER trentorienta
CMD ["java", "-jar", "trentorientaService.jar"]