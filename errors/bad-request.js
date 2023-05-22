const CustomError = require("./custom-error");

const BadRequestError = (message) => {
  return new CustomError(message, 400);
};

module.exports = BadRequestError;
