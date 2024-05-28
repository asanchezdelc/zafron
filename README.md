# Zafron

A rudimentary and simple dashboard for devices such as Arduinos, ESP family, RaspberryPi, LoRaWAN, HTTP and more. This project was brought to life due to Cayenne EOL. It uses the Cayenne MQTT protocol to send data to the server. 

[Documentation](https://zafron.dev/docs)

Get started quickly using [Zafron Cloud](https://zafron.dev)

<img src="https://github.com/asanchezdelc/zafron/blob/main/docs/lander.png?raw=true" alt="Lander" width="500"/>
<img src="https://github.com/asanchezdelc/zafron/blob/main/docs/logs.png?raw=true" alt="Logs" width="500"/>

## Requirements
- NodeJS
- MongoDB `docker run -d -p 27017:27017 mongo`
- Redis `docker run -d -p 6379:6379 redis`
- RabbitMQ (optional) `docker run -d -p 5672:5672 rabbitmq`
- npm

## Migrate Cayenne Projects
Migrating Cayenne projects to Zafron is easy. Zafron is a drop-in replacement for Cayenne. The only thing you need to do is change the MQTT server hostname and the MQTT credentials. [Learn More](https://zafron.dev/docs/cayenne)

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

