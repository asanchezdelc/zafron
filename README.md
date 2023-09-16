# Zafron

A rudenmentary and simple dashboard for devices such as Arduinos, ESP family, RaspberryPi, and more. This project was brought up to life due to Cayenne EOL. It uses the Cayenne MQTT protocol to send data to the server. 

**Work in progress.**

<img src="https://github.com/asanchezdelc/zafron/blob/main/docs/lander.png?raw=true" alt="Lander" width="500"/>

## Requirements
- NodeJS
- MongoDB
- Redis
- npm

## Getting Started
The quickest way to get started is to use docker-compose. This will start the server and the database. You will need to provide the MQTT credentials in the docker-compose.yml file. 

```shell
git clone https://github.com/asanchezdelc/zafron
cd zafron
docker-compose up -d
```

Navigate to `http://localhost:3000``

### Build from source
```shell
git clone https://github.com/asanchezdelc/zafron
cd zafron
npm install
```
Run the frontend
```shell
npm run start
```
Run the backend
```shell
PORT=8080 node app.js
```

## Test

Use mosquitto_pub or MQTT.fx to test/send data to the broker with the proper credentials.

```shell
mosquitto_pub -h localhost -t v1/thingscafe/things/device-d5f5/data/json -m "[{\"channel\":0,\"value\":1,\"type\":\"temp\", \"unit\":\"f\"}]]"
```


## ToDo
- Example code for ESP8266
- Example code for NodeMCU
- Example code for RaspberryPi

