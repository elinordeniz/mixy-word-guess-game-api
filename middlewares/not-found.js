const notFoundMiddleware = (req, res) => {
  res.status(400).send("The route was not found");
};

module.exports = notFoundMiddleware;
