const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const mongoose = require('mongoose');

// Connect to Mongo Server
mongoose.connect("mongodb://admin:password123@ds311968.mlab.com:11968/git-connected", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (error) => (error) ? console.log(error) : console.log("connected to database"));

// Define schema
let usersSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String,
  githubname: String,
  location: String,
  favoriteColor: String,
});

// variable holding the users schema
let users = mongoose.model("users", usersSchema);

// route
app.get('/users', (req, res) =>
  mongoose.model("users").find((err, users) => res.send(users))
);



// Manually adds user to db.
// users.create({
//   name: "Anew Uzer",
//   location: "Adminville, KS",
//   favoriteColor: "Orange"
// }, (err, data) => {
//   (err) ? console.log("problem logging data " + data) : console.log("added data to collection " + data);
// });


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
//