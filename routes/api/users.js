const express = require('express');
const router = express.Router();
const usersCollection = require('../../models/users');

router.get('/users', async (req, res) => {
  try {
    let data = await usersCollection.find();
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({msg: "Unable to get db info"});
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    id = req.params.id;
    let data = await usersCollection.find();
    let returnUser;
    returnUser = data.filter((usr) => usr._id == id);
    res.json(returnUser);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).json({msg: "Unable to find user: " + id});
  }
});

/*
  username: {
    type: String
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  githubname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  githubavatar: {
    type: String
  },
  location: {
    type: String
  },
  comments: {
    type: Array
  },
  friends: {
    type: Array
  }
});
*/

router.post('/users', async (req, res) => {
  try {
    console.log(req.body);
    let newUser = await new usersCollection({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      githubname: req.body.githubname,
      password: req.body.password,
      location: "San Antonio, Texas",
      comments: [],
      friends: [],
    })
    const save = newUser.save();
    res.json(save);
  } catch (err) {
    console.error(error.message);
    res.status(500).json({msg: "Unable to POST"});
  }
});

// Put is used for comments
router.put('/users/:_id', async (req, res) => {
  try {
    id = req.params._id;
    let user = await usersCollection.findOneAndUpdate({ _id: id }, req.body);
    res.sendStatus(200);

  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).json({msg: "Unable to find user: " + id});
  }
});

router.delete('/users/:_id', async (req, res) => {
  try {
    let id = req.params._id;
    console.log("id to delete is: " + id);
    let user = await usersCollection.findOneAndRemove({ _id: id });
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({msg: "Unable to DELETE"});
  }
})

module.exports = router;