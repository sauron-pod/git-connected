
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');


server.use('/api', router);


// app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));