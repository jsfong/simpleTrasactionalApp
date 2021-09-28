'use strict';

const { response } = require('express');
const express = require('express');
const redis = require("redis");
const cors = require("cors");
const app = express();

//Hostname & Port
//Hostname should be equal to container name when running node is container
const hostname = process.env.HOST_NAME || 'localhost';
const port = 3000;
const redisHostname = process.env.REDIS_HOST_NAME || '127.0.0.1';
const redisPort = 6379;

// Connect redis
const redisClient = redis.createClient(redisPort, redisHostname);
redisClient.on("connect", () => {
    console.log(`Connected to redis at ${redisHostname}:${redisPort}`)
});

//Middleware
app.use(cors());
app.use(express.json());

//POST
app.post('/transaction', (req, res) => {

    const body = req.body;
    console.log(`Receive request: ${JSON.stringify(body)}`);

    if (!body.userId || !body.metadata) {
        res.status(400).send();

    } else {
        let timeLog = 'Time taken';
        console.time(timeLog);

        //Save data to redis
        let keyName = Math.random().toString().substr(2, 10);
        let transactionData = "test_value";

        if (body.userId)
            keyName += `_${body.userId}`;

        if (body.metadata)
            transactionData = body.metadata;

        redisClient.set(keyName, transactionData, redis.print);

        console.timeEnd(timeLog);
        res.status(200).send(`Transaction ID: ${keyName}`);
    }


});

//GET
app.get('/record/:transactionId', (req, res) => {

    const transactionId = req.params.transactionId;
    console.log(`Getting transaction id: ${transactionId}`);

    if (!transactionId) {
        res.status(400).send();
    } else {

        redisClient.get(transactionId, (err, response) => {
            if (err) {
                console.log(`Error getting transaction id: ${transactionId}`);
                res.status(400).send();

            } else {
                if (response) {
                    res.status(200).json({
                        "transactionId": transactionId,
                        "transactionMetadata": response
                    });

                } else {
                    res.status(404).send();

                }
            }
        });

    }
});


//DELETE
app.delete('/record', (req, res) => {
    console.log('Delete all transaction record');

    redisClient.flushall((err, response) => {
        if (err) console.error(err);
        if (response) console.log(response);
        res.status(200).send();
    });
});

app.delete('/record/:transactionId', (req, res) => {
    const transactionId = req.params.transactionId;
    console.log(`Delete transaction record id: ${transactionId}`);

    if (!transactionId) {
        res.status(400).send();
    } else {
        redisClient.del(transactionId, (err, response) => {
            if (err) {
                console.error(err);
                res.status(400).send();
            } else {
                console.log(response);
                res.status(200).send();
            }
        });
    }

});

//Setup server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});


