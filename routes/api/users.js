const express = require('express');
const router = express.Router();
const usersCollection = require('../../models/users');

router.get('/users', async (req, res) => {
  try {
    let data = await usersCollection.find();
    console.log(data);
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
  
router.post('/users', async (req, res) => {
  try {
    console.log(req.body);
    let newUser = await new usersCollection({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      githubname: req.body.githubname,
      friends: [],
      location: "San Antonio, Texas"
    })
    const save = newUser.save();
    res.json(save);
  } catch (err) {
    console.error(error.message);
    res.status(500).json({msg: "Unable to POST"});
  }
});

router.put('/users/:_id', async (req, res) => {
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

router.delete('/users/:_id', async (req, res) => {
  try {
    console.log("id to delete is: " + _id);
  } catch (err) {
    console.error(error.message);
    res.status(500).json({msg: "Unable to DELETE"});
  }
})

module.exports = router;