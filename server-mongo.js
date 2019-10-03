const express = require('express');
const path = require('path');

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
app.use('/users', require('./routes/api/users'));

// Connect to mongo DB
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Handle DB errors
db.on('error', (err) => console.log(err));
db.once('open', () => {
  require('./routes/api/users');
  console.log("db listening on port: " + config.PORT);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));