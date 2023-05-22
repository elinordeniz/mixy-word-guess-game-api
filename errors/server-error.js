const CustomError = require("./custom-error");

const ServerError = (message) => {
  throw new CustomError(message, 500);
};

module.exports = ServerError;
