const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValiId'))
    .then((card) => {
      card.remove();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'NotValiId') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (res.status(404)) {
        res.send({ message: 'Карточка с указанным _id не найдена' });
      } else if (res.status(500)) {
        res.send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new Error('NotValiId'))
    .then((card) => {
      res.send({ data: card });
    }).catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'NotValiId') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (res.status(404)) {
        res.send({ message: 'Карточка с указанным _id не найдена' });
      } else if (res.status(500)) {
        res.send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(new Error('NotValiId'))
    .then((card) => {
      res.send({ data: card });
    }).catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'NotValiId') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (res.status(404)) {
        res.send({ message: 'Карточка с указанным _id не найдена' });
      } else if (res.status(500)) {
        res.send({ message: 'Произошла ошибка' });
      }
    });
};
