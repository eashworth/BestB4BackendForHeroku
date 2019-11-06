require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const PORT = process.env.PORT || 5000

app.use(express.json({ extended: false }))

// app.listen(PORT, () => console.log('Server has started'));

app.get('/', (req, res) => res.send('Hello'));

const remoteTestdb = process.env.MONGO_URI_BESTB4_TEST;
const proddb = process.env.MONGO_URI_BESTB4_PROD;
const remoteDevdb = process.env.MONGO_URI_BESTB4_DEV;

if (process.env.NODE_ENV === 'test') {
  console.log("**********Your NODE_ENV is", process.env.NODE_ENV," : Connecting to your remote MongoDB Atlas test database**********");
  mongoose.connect(remoteTestdb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then( () => console.log("********** Remote MongoDB Atlas test db successfully connected! **********"))
    .catch((err) => console.log(err));
}
else if (process.env.NODE_ENV === 'local-test') {
  console.log("**********Your NODE_ENV is", process.env.NODE_ENV," : Connecting to your local test database**********");
  mongoose.connect('mongodb://localhost/bestB4test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then( () => console.log("********** Local Mongo test db successfully connected! **********"))
    .catch((err) => console.log(err));
}
else if (process.env.NODE_ENV === 'local-development') {
  console.log("**********Your NODE_ENV is", process.env.NODE_ENV," : Connecting to your local development database**********");
  mongoose.connect('mongodb://localhost/bestB4', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then( () => console.log("********** Local Mongo dev db successfully connected! **********"))
    .catch((err) => console.log(err));
}
else if (process.env.NODE_ENV === 'production') {
  mongoose.connect(proddb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .catch((err) => console.log(err));
}
else { //i.e. dev (remote)
  console.log("**********Your NODE_ENV is", process.env.NODE_ENV," : Connecting to your Remote MongoDB Atlas dev database**********");
  mongoose.connect(remoteDevdb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then( () => console.log("********** Remote MongoDB Atlas dev db successfully connected! **********"))
    .catch((err) => console.log(err));
}

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/messages', require('./routes/api/messages'));


module.exports = app
