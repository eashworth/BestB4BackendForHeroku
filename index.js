require('dotenv').config();
const path = require('path');

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

// The current path is:
app.use('/api/users', require('./app/routes/api/users'));

// I want to require '/app/routes/api/users.js',
// So I will use:
// path.join(__dirname, './app', './routes/api/users')
// app.use('/api/users', require(path.join(__dirname, './', './routes/api/users')));

app.use('/api/auth', require('./app/routes/api/auth'));
// app.use('/api/users', require(path.join(__dirname, './', './routes/api/auth')));

app.use('/api/posts', require('./app/routes/api/posts'));
// app.use('/api/users', require(path.join(__dirname, './', './routes/api/posts')));

app.use('/api/login', require('./app/routes/api/login'));
// app.use('/api/users', require(path.join(__dirname, './', './routes/api/login')));

module.exports = app

  // .then(() => {
  // console.log("We have connected")
  // })
