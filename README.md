nodejs-publish-iot-sensor
=========================

nodejs iot sensor app project

# Basic Internet of Things Sensor Application

This application is derived from iot project on the book. The initial project has multiple scenarios in it, so I thought categorized as partial projects based on scenarios seemed good idea.

## README version 0.1.0

Basic IoT (Internet of Things) application which specifies and collects sensor datum around the device. The device variation could be differed and switched by developer or user. By default, Beaglebone black is used to perform collecting sensor data. This repository only deals with sensor application, however, this application could be expanded and merged with other IoT application of the author, such as IoT Streamer application, IoT Configuration application, and so forth.

IoT Sensor application is divided into few features as the following : 

* *Sensor data collection* : The most fundamental feature, which is to get sensor data. Sensor attributes can be differed by devices' sensor. Sensors should be detectable from the low-level linux. Later, recently attached sensors may automatically detectable and realized by system.
* *Sensor data distribution* : Collected Sensor datum are linearly published to servers or clients that are interested to such data. Subscription is ideally unlimited to any candidates. Publish-Subscribe scenarios are done by popular network protocols such as HTTP, UDP, TCP, or websockets
* *Sensor Status Configuration* : Sensor status can be monitored through configuration web page
* *Sensor device Management* : Sensor devices are managed and life-cycles are controlled by heartbeat protocols

## Getting Started

### Running Server

The following are general sequences to run the application :

1. setting hostname and port for iot-sensor server

2. run the server by typing "node app.js" on terminal

3. monitor and manage the sensor surroundings by visit "http://{hostname}:{port}"

4. corresponding sensors are published to any clients that are accessed. 

### Environments

- OS which supports Node.js & Javascript : Linux, MacOS, Windows
- For Client or viewing config/status web page, one needs to access browsers which supports websockets, socket.io


### Application Boundaries

Although none of new settings need to be applied, application's boundary needs to be considered before running at least once. Some properties are as follows:

- only sensor datum are distributed and parsed to clients
- web server, stream server, and client are included

### Application Binding with other IoT Application

Multiple IoT Applications can be bound by sharing and connecting web server and streaming server.


## Contact

