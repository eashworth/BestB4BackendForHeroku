const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'password is required').exists({ min: 6 })
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email: email })

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

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
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  });

module.exports = router;
