const express = require("express");
const config = require("./config");
const api = require("./api");
const bodyParser = require('body-parser');
const AutoComplete = require('./autocomplete');

const startServer = () => {
  const app = express();
  const port = config.server.port;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


  app.use("/api", api);

  AutoComplete.then((obj) => {
    app.listen(port, () => {
      console.log("server is running on port " + port);
    });  
  });
};

startServer();
