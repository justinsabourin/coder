FROM node


ENV NODE_ENV "production"


RUN mkdir -p /home/server/app
COPY . /home/server/app

WORKDIR /home/server/app
RUN npm install --production

EXPOSE 8080

CMD npm start