const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62f4ccbdd0f52170b9128e8a',
//   };
//   next();
// });

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('/*', (req, res) => { res.status(404).send({ message: 'Произошла ошибка' }); });

app.listen(PORT);
