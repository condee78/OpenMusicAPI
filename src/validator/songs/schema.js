const Joi = require("joi");

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  // eslint-disable-next-line newline-per-chained-call
  year: Joi.number().integer().min(1900).max(2030).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().required(),
});

module.exports = { SongsPayloadSchema };
