# Simple Transactional Application
## Problem Statement
This is a simple transactional application which based on micro services architecture.

The objective is to handle 500 transaction per second.


## Assumption
- User will execute a transaction via Restful API with input data less than 5kb.
- Transaction result will be persist in in-memory storage and return in the response of API.
- All compose will be deployed on local docker engine.
- HTTP is use. No security encryption / TLS.


## Estimation
Our system will only be write-heavy. It will generate transactional data and persist into storage.


### Read/Write ratio
Since the write-heavy will be mostly writing. Read/Write ratio can be assumpt:

> 0:1


### Traffic
Assuming we have to achieve 500 transaction per second and read/write ratio = 0:1. We can expect:

> 500 write/s

> 0 read/s

###  Storage / Memory
Assuming every transaction will generate and persist the transactional data into the in-memory storage. One key value pair will be store per transaction.

By assuming each store object will be approximation 120 bytes. We will need total storage:

> 500 * 120 bytes = 60kb/s

# System APIs

API documentation can be access at: [http://localhost:8082](http://localhost:8082)

# High Level Design

![image](./Resources/Transaction_1.jpeg)

![image](./Resources/Transaction.jpeg)


### Reverse Proxy / Load balancer
Nginx will be use as reverse proxy and load balancing the transaction server. All request will be handle and route by Nginx. 


When scaling transaction server, Nginx will be using round robin to load balance across instance of transaction server.

Proxy can be access at: [http://localhost:8080](http://localhost:8080)

### Transaction Server
A micro service server that able to handle Restful API. Nodejs is used.

### In Memory Storage
Redis is used to store simple key value pair. 
* Key = Transaction ID + User ID
* Value = Sample Transaction data.

### Monitoring / Logging
ELK stack will be use to collect log and metric of transaction server.

Monitoring Server can be access at: [http://localhost:5601](http://localhost:5601)

# Installation & Deployment
## Prerequisites
- Docker
- Docker compose
- Jmeter

## Building
The script will build web_service and tag as web_service:1.0 as docker image.
```bash
sh Deployment\build_docker.sh
```

## Deploy
```bash
cd Deployment\
docker-compose up -d 
```
This will bring up all services

```bash
cd Deployment\
docker-compose ps
           Name                         Command               State                         Ports
------------------------------------------------------------------------------------------------------------------------
deployment_elasticsearch_1   /usr/local/bin/docker-entr ...   Up      0.0.0.0:9200->9200/tcp,:::9200->9200/tcp, 9300/tcp
deployment_filebeat_1        /usr/local/bin/docker-entr ...   Up
deployment_kibana_1          /usr/local/bin/kibana-docker     Up      0.0.0.0:5601->5601/tcp,:::5601->5601/tcp
deployment_metricbeat_1      /usr/local/bin/docker-entr ...   Up
deployment_nginx_1           nginx -g daemon off;             Up      0.0.0.0:8080->80/tcp,:::8080->80/tcp
deployment_web_1             docker-entrypoint.sh node  ...   Up      3000/tcp
redis                        docker-entrypoint.sh redis ...   Up      0.0.0.0:6379->6379/tcp,:::6379->6379/tcp
swagger_ui_container         /docker-entrypoint.sh sh / ...   Up      80/tcp, 0.0.0.0:8082->8080/tcp,:::8082->8080/tcp


```

# Load Testing
Jmeter test file is located at:
```./Test/TransactionalServerTest.jmx```

In order to run load test. 
- Please ensure Jmeter is install / downloaded.
- Change the Jmeter path in JMETER_PATH variable inside```./Test/runLoadTest.sh``` accordingly

```bash
#!/bin/bash

JMETER_PATH="D:\Dev\nodejs\apache-jmeter-5.4.1\bin\jmeter"
```

## Executing Load Test
```bash
sh .\Test\runLoadTest.sh
```

A test report will be generated at ```.\Test\report\index.html``` when load test is successful.

# Future Improvement
To improve the throughput if the transaction is long processing process, instead of transaction server directly write to storage. We can implement a message queue to hold the transaction request and multiple transaction server as worker to process the transaction and persist to DB.

![image](./Resources/Transaction_2.jpeg)

### Transaction Management Server
RESTFul API server able to accept transaction request, query transaction status and get transaction result. Provider to message queue.

### MQ
Message queue to hold all the transaction request.

### Transaction Server
Consumer of the message queue. Process all the massage queue. Cache and persist into database.

# Reference
https://github.com/qishibo/AnotherRedisDesktopManager/releases
