// server.js
/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

// Modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
// Config

const config = require("./server/config");

/*
 |--------------------------------------
 | MongoDB
 |--------------------------------------
 */
require("dotenv").config();
const dotenv = require("dotenv");
dotenv.config();

const mongoUser = config.MONGOUSER;
const mongoPassword = config.MONGOPASS;

console.log("Mongo UserName : ", mongoUser);

const uri =
  "mongodb+srv://" +
  mongoUser +
  ":" +
  mongoPassword +
  "@hyperion-dev-leon-stevens-webdev-qiwgg.mongodb.net/bugtracker?authSource=admin&replicaSet=Hyperion-Dev-Leon-Stevens-WebDev-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true }
);
mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log("DB Connection Error: ", err.message);
  });
// show error if no connection to the database can be established
mongoose.connection.on("error", function (err) {
  console.log("Could not connect to the database. Exiting now...", err);
  process.exit();
});

// confirm database connection with log
mongoose.connection.once("open", function () {
  console.log("Successfully connected to the database");
});

/*
 |--------------------------------------
 | App
 |--------------------------------------
 */

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(cors());

// Set port
const port = process.env.PORT || "8083";
app.set("port", port);
/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */

require("./server/api")(app, config);

/*
// Don't run in dev
if (process.env.NODE_ENV !== "dev") {
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/dist/mean-rsvp/index.html"));
  });
}

/*
 |--------------------------------------
 | Server
 |--------------------------------------
 */

app.listen(port, () => console.log(`Server running on localhost:${port}`));
