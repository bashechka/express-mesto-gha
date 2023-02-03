const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const constants = require('http2');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());

app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// наш централизованный обработчик
app.use((err, req, res, next) => {
  const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || 'Неизвестная ошибка';
  res.status(status).send({ message });
  next();
});

app.use(errorLogger); // подключаем логгер ошибок

// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
