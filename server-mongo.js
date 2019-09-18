const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');

// const mongoose = require('mongoose');

// mongoose.connect("mongodb://admin:password123@ds311968.mlab.com:11968/git-connected", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }, (error) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("connected to database");
//   }
// });

// let usersSchema = new mongoose.Schema({
//   name: String,
//   location: String,
//   favoriteColor: String
// });

// let users = mongoose.model("users", usersSchema);

// Manually adds user to db.
// users.create({
//   name: "Anew Uzer",
//   location: "Adminville, KS",
//   favoriteColor: "Orange"
// }, (err, data) => {
//   (err) ? console.log("problem logging data " + data) : console.log("added data to collection " + data);
// });

server.use('/api', router);
server.use('/users', router);

// Gets users from mongodb database
// app.get('/users', (req, res) => {
//   mongoose.model('users').find((err,users) => {
//     res.send(users);
//   })
// })

// test route to db
// app.get('/users', (req, res) => res.send("this is suppose to be the database"));

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));