const express = require('express');
const router = express.Router();
const commentsSchema = require('../../models/comments');

// router.get('/comments', async (req, res) => {
//   try {
//     let data = await commentsSchema.find();
//     res.json(data);
//   } catch (err) {
    
//   }
// })

module.exports = router;