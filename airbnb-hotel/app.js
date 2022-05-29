require("dotenv").config();
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

var app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require("./models/mongo/hotel");
require("./models/mongo/user");

mongoose.Promise = global.Promise;

// const connectOptions = {
//   useMongoClient: true,
//   autoIndex: false, // Don't build indexes
//   reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//   reconnectInterval: 500, // Reconnect every 500ms
//   poolSize: 10, // Maintain up to 10 socket connections
//   connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
//   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   ssl: true,
//   replicaSet: "atlas-7ce6hl-shard-0",
//   authSource: "admin",
//   w: "majority",
// };

const connectOptions = {
  useMongoClient: true,
  ssl: true,
  replicaSet: "globaldb"
}

if (process.env.MONGODB_URI == undefined) {
  console.error(
    "process.env.MONGODB_URI is undefined. You need to provide the mongoDB connection information."
  );
}

var promise = mongoose.connect(process.env.MONGODB_URI, connectOptions);
promise
  .then(() => {
    console.dir("CONNECTED TO " + process.env.MONGODB_URI);

    var Hotel = mongoose.model("Hotel");

    // Check if the hotels are empty, insert mock data
    Hotel.count({}, function (err, c) {
      if (c == 0) {
        console.dir("No hotels found in the database. Loading data.");
        var itemsMock = require("./data/hotels.json");
        Hotel.collection.insertMany(itemsMock, function (err, r) {
          if (err) {
            console.error("Error inserting hotels: " + err);
          } else {
            console.dir("Hotels loaded.");
          }
        });
      } else {
        console.dir(err);
        console.dir(c + " hotels found in the database. Skipping loading data.");
      }
    })
  })
  .catch((err) => {
    console.error("ERROR: UNABLE TO CONNECT TO " + process.env.MONGODB_URI);
    console.error(
      "Make sure you have set the environment variable MONGODB_URI to the correct endpoint."
    );
    console.error(err.message);
  });

var hotels = require("./routes/hotel");

app.get("/message", (req, res, next) =>
  res
    .json({ message: "Default /api endpoint for hotel-service-api" })
    .status(200)
);

app.use("/", hotels);

app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
