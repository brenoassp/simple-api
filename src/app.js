const express = require("express");
const config = require("./config");
const api = require("./api");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const connectToDatabase = (config) => {
  mongoose.connect(config.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = mongoose.connection;
  db.on("error", () => {
    console.log("error while trying to connect to mongodb server");
  });
  db.on("open", () => {
    console.log("we are connected to mongodb");
  });
};

connectToDatabase(config);

const app = express();
const port = config.server.port;

app.use(bodyParser.json());
app.use("/api", api);

app.listen(port, () => {
  console.log("server is running on port " + port);
});
