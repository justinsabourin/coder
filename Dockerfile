# switch to alpine at some point, much smaller
#FROM node:alpine
#RUN apk add --update redis haproxy mongodb

FROM mongo

SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install -y memcached curl

#### Taken from here https://semaphoreci.com/community/tutorials/dockerizing-a-node-js-web-application
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 6.10.0

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Set up our PATH correctly so we don't have to long-reference npm, node, &c.
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
####

ENV NODE_ENV "production"

RUN mkdir -p /data/db
RUN mkdir -p /home/server/logs
RUN mkdir -p /home/server/app
COPY ./app /home/server/app

WORKDIR /home/server/app
RUN npm install --production


EXPOSE 8080

CMD service memcached start && mongod --fork --logpath '/home/server/logs/mongo.log' && npm start