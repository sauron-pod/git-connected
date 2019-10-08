const express = require('express');
const path = require('path');
const router = require('./routes/api/users');

const mongoose = require('mongoose');
const config = require('./config/config');
const bodyParser = require('body-parser');

// Init express
const app = express();
const port = process.env.PORT || 3000;

// Use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static endpoint handlers
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/users', router); // Get all accounts
app.get('/users/:id', router); // Get account
app.post('/users', router); // Create account
app.delete('/users/:id', router); // Delete accounts

app.put('/users/:id', router); // Put for comments

// app.use('/users', (req, res) => res.sendStatus(418));

// Connect to mongo DB
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection;

// Handle DB errors
db.on('error', (err) => console.log(err));
db.once('open', () => {
  require('./routes/api/Users');
  console.log("db listening on port: " + config.PORT);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));