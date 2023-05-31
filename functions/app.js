require("dotenv").config();
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser= require('body-parser')
const express = require("express");
const app = express();
const router = express.Router();

const PORT = process.env.PORT || 1299;
const wordRouter = require("../routes/word");
const notFoundMiddleware = require("../middlewares/not-found");
const customErrorHandlerMiddleware = require("../middlewares/error-handler");
const swaggerUI= require('swagger-ui-express');
const YAML= require('yamljs');

var path = require('path');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ strict: false }));

let swagger_path = path.resolve(__dirname,'../swagger.yaml');

//const file  = fs.readFileSync(swagger_path, 'utf8')
const swaggerDocument= YAML.load(swagger_path)
//const swaggerDocument = require('../swagger.json');

// var options = {
   
//      "isTrusted": true 
  
// };
//routes
app.use("/.netlify/functions/app", router);
app.use("/", router);

router.get("/", (req, res) => {
  res.send('<h1>Welcome to Mixy Mixy Word Game Api</h1><a href="/swagger">Documentation</a>');
});

// router.use("/swagger", swaggerUI.serve);
// router.get("/swagger", swaggerUI.setup(swaggerDocument, options));

router.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
router.use("/api/v1/word", wordRouter);

// error middlewares
router.use(notFoundMiddleware);
router.use(customErrorHandlerMiddleware);

// app.listen(PORT, () => {
//   console.log(`Server is listenin on PORT ${PORT}`);
// });

module.exports.handler = serverless(app);
