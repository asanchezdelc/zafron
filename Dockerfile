FROM node:20-alpine

# Create app directory
RUN mkdir -p /src/app
WORKDIR /src/app

# Install app dependencies
COPY package.json /src/app/
COPY .env.example /src/app/.env

RUN npm install

# Bundle app source
COPY . /src/app

# Build and optimize react app
RUN npm run build

EXPOSE 3000
#EXPOSE 1883

# defined in package.json
CMD [ "node", "app.js" ]