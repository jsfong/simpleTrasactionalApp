
'use strict';

const express = require('express');
const redis = require("redis");

//Hostname & Port
//HTTP
//Hostname should be equal to container name when running node is container
const hostname = process.env.HOST_NAME || 'localhost';
const port = 3000;

//Redis
const redisHostname = process.env.REDIS_HOST_NAME || '127.0.0.1';
const redisPort = 6379;

const app = express();
const redisClient = redis.createClient(redisPort, redisHostname);


// Connect redis
redisClient.on("connect", () => {
    console.log(`Connected to redis at ${redisHostname}:${redisPort}`)
});


//Handle rest
app.get('/', (req, res) => {
    let timeLog = 'Time taken';
    console.time(timeLog);

    //Save data to redis
    const keyName = Math.random().toString().substr(2, 10);
    redisClient.set("test_key", "test_value", redis.print);

    console.timeEnd(timeLog);
    res.status(200).send('Hello World');
});

//Setup server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});


