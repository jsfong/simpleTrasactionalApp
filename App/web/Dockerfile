FROM node:14-alpine

#Create app directory
WORKDIR /usr/src/app

#Copy package json
COPY package*.json ./

RUN npm install --only=production
# If building  code for production
# RUN npm ci --only=production

COPY . . 

EXPOSE 3000

CMD [ "node", "app.js" ]
