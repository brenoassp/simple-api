const express = require("express");
const config = require("./config");
const api = require("./api");
// const { mongoManager } = require("./src/mongo");

const app = express();
const port = config.server.port;
// mongoManager.connect();

app.use("/api", api);

app.listen(port, () => {
  console.log("server is running on port " + port);
});
