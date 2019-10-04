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

router.post('/users', async (req, res) => {
  try {
    console.log(req.body);
    let newUser = await new usersCollection({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      githubname: req.body.githubName,
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

module.exports = router;