const mongoose = require('mongoose');

// Base this off of the objects on the signup page.
const UserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  githubname: {
    type: String,
    required: true
  },
  githubavatar: {
    type: String
  },
  location: {
    type: String
  },
  friends: {
    type: Array
  }
});

const users = mongoose.model('Users', UserSchema);

module.exports = users;