# switch to alpine at some point, much smaller
#FROM node:alpine
#RUN apk add --update redis haproxy mongodb

FROM node

RUN apt-get update && apt-get install -y redis-server haproxy mongodb


RUN export NODE_ENV="production"

RUN mkdir -p /data/db
RUN mkdir -p /home/server/logs
RUN mkdir -p /home/server/app
COPY ./app /home/server/app


WORKDIR /home/server/app/frontend
RUN npm install

WORKDIR /home/server/app/authorization
RUN npm install

WORKDIR /home/server/app/projects
RUN npm install

WORKDIR /home/server/app/content
RUN npm install

EXPOSE 8080
WORKDIR /home/server/app
CMD bash docker-entrypoint.sh