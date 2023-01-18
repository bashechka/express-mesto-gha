const express = require('express');
const mongoose = require('mongoose');

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '63c22e07d3611cbaf5aa174c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('/*', (req, res) => {
  res.status(404).send('Страница не существует');
});
