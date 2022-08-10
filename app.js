const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62f3ff0585f441b75612d94b',
  };
  next();
});
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.listen(PORT);
