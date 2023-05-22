require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 1299;
const wordRouter = require("./routes/word");
const notFoundMiddleware = require("./middlewares/not-found");
const customErrorHandlerMiddleware = require("./middlewares/error-handler");
const swaggerUI= require('swagger-ui-express');
const YAML= require('yamljs');
const swaggerDocument= YAML.load('./swagger.yaml')
app.use(cors());
app.use(express.json());

//routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send('<h1>Welcome to Mixy Mixy Word Game Api</h1><a href="/api-docs">Documentation</a>');
});

app.use("/api/v1/word", wordRouter);

// error middlewares
app.use(notFoundMiddleware);
app.use(customErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is listenin on PORT ${PORT}`);
});
