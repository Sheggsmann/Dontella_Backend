const mongoose = require("mongoose");
const winston = require("winston");

let mongo_uri = process.env.dontella_db || "mongodb://localhost/dontella_vine";

if (!mongo_uri) {
  console.log("[FATAL ERROR]: No database connection string provided.");
  process.exit(1);
}

module.exports = function () {
  mongoose
    .connect(mongo_uri)
    .then(() => {
      console.log("[CONNECTED TO DATABASE]");
      winston.info(`Connected to Database`);
    })
    .catch((err) => {
      console.log(err.message);
      winston.error(err.message);
    });
};
