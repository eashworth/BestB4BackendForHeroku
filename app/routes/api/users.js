const config = require('config');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const User = require('../../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, postcode } = req.body
    try {
      let user = await User.findOne({ email: email })
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
      }
      const avatar = gravatar.url(email)
      user = new User({
        name,
        email,
        password,
        postcode,
        avatar
      })
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      console.log(user)
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw error;
          res.json({ token });
        }
      )

    } catch (err) {
      res.status(500).send('Server Error')
    }

  })

module.exports = router;