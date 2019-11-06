require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const PORT = process.env.PORT || 5000

app.use(express.json({ extended: false }))

// app.listen(PORT, () => console.log('Server has started'));

app.get('/', (req, res) => res.send('Hello'));

const testdb = process.env.MONGO_URI_BESTB4_TEST;
const proddb = process.env.MONGO_URI_BESTB4_PROD;
const devdb = process.env.MONGO_URI_BESTB4_DEV;

if (process.env.NODE_ENV === 'test') {
  // mongoose.connect('mongodb://localhost/bestB4test', {
  mongoose.connect(testdb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    // .then( () => console.log("NODE_ENV=", process.env.NODE_ENV, "MongoDB test db connected"))
    .catch((err) => console.log(err));
} else if (process.env.NODE_ENV === 'production') {
  // mongoose.connect('mongodb://localhost/bestB4test', {
  mongoose.connect(proddb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    // .then( () => console.log("NODE_ENV=", process.env.NODE_ENV, "MongoDB production db connected"))
    .catch((err) => console.log(err));
} else {
  // mongoose.connect('mongodb://localhost/bestB4', {
  mongoose.connect(devdb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then( () => console.log("NODE_ENV=", process.env.NODE_ENV, ": MongoDB dev db connected"))
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
