const CustomError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const customErrorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error, please try again later!" });
};

module.exports = customErrorHandlerMiddleware;
