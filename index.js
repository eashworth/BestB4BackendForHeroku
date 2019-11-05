const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const PORT = process.env.PORT || 5000

app.use(express.json({ extended: false }))

// app.listen(PORT, () => console.log('Server has started'));

app.get('/', (req, res) => res.send('Hello'));

const testdb = require('./config/keys').mongoURIbestb4test;
const db = require('./config/keys').mongoURIbestb4dev;

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(testdb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then( () => console.log("MongoDB test db connected"))
    .catch((err) => console.log(err));
} else {
  // mongoose.connect('mongodb://localhost/bestB4', {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then( () => console.log("MongoDB dev db connected"))
    .catch((err) => console.log(err));
}

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/login', require('./routes/api/login'));

module.exports = app

  // .then(() => {
  // console.log("We have connected")
  // })
