# Zafron

A rudenmentary and simple dashboard for devices such as Arduinos, ESP family, RaspberryPI. This project was brought up to life due to Cayenne EOL. It uses the Cayenne MQTT protocol to send data to the server. It is a work in progress.

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
docker-compose up
```

### Build from source
```shell
git clone https://github.com/asanchezdelc/zafron
cd zafron
npm install
npm start
```

# Test

```shell
mosquitto_pub -h localhost -t v1/thingscafe/things/device-d5f5/data/json -m "[{\"channel\":0,\"value\":1,\"type\":\"temp\", \"unit\":\"f\"}]]"
```


## To Do
- Example code for ESP8266
- Example code for NodeMCU
- Example code for RaspberryPi

