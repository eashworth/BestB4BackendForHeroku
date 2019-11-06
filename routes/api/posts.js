const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post')

router.post('/', [auth, [
  check('description', 'Description is required')
    .not()
    .isEmpty(),
  check('expiry', 'Expiry is required')
    .not()
    .isEmpty()
]
],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')
      console.log(user)
      const newPost = new Post({
        description: req.body.description,
        expiry: req.body.expiry,
        name: user.name,
        postcode: user.postcode,
        avatar: user.avatar,
        user: req.user.id
      });
      const post = await newPost.save()
      console.log(post)
      res.json(post)
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Server Error')
    }
  }
)

router.get('/', auth, async (req, res) => {
  try {
    currentUser = req.user.id

    const posts = await Post.find({ user: { $ne: currentUser } }).sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.log(err.message)
    res.status(500).send("server error")
  }
})

router.get('/currentuser', auth, async (req, res) => {
  try {
    console.log(req.user)
    const posts = await Post.find({ user: req.user.id }).sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.log(err.message)
    res.status(500).send("server error")
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.json(post)
  } catch (err) {
    console.log(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send("server error")
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorised" })
    }

    await post.remove();

    res.json({ msg: "Post removed" })
  } catch (err) {
    console.log(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send("Server error")
  }
})

module.exports = router;
