
'use strict';

const http = require('http');

//Hostname should be equal to container name when running node is container
const hostname = process.env.HOST_NAME || 'localhost';
const port = 3000;



const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end(`Hello world`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

