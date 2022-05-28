require("dotenv").config();
var express = require("express");
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

// Add your models here
require("./models/mongo/booking");
require("./models/mongo/payment");

mongoose.Promise = global.Promise;

const connectOptions = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    ssl: true,
    replicaSet: "atlas-7ce6hl-shard-0",
    authSource: "admin",
    w: "majority",
};

if (process.env.MONGODB_URI == undefined) {
    console.error(
        "process.env.MONGODB_URI is undefined. You need to provide the mongoDB connection information."
    );
}

var promise = mongoose.connect(process.env.MONGODB_URI, connectOptions);
promise
    .then(() => {
        console.dir("CONNECTED TO " + process.env.MONGODB_URI);

        // Load data into models from files using this following example
        var Payment = mongoose.model("Payment");

        // Check if the payments are empty, insert mock data
        Payment.count({}, function (err, c) {
            if (c == 0) {
                console.dir("No payments found in the database. Loading data.");
                var itemsMock = require("./data/payments.json");
                Payment.collection.insertMany(itemsMock, function (err, r) {
                    if (err) {
                        console.error("Error inserting payments: " + err);
                    } else {
                        console.dir("Payments loaded.");
                    }
                });
            } else {
                console.dir(
                    c +
                        " payments found in the database. Skipping loading data."
                );
            }
        });
    })
    .catch((err) => {
        console.error("ERROR: UNABLE TO CONNECT TO " + process.env.MONGODB_URI);
        console.error(
            "Make sure you have set the environment variable MONGODB_URI to the correct endpoint."
        );
        console.error(err.message);
    });

// Add your routes here
var payments = require("./routes/payment");

app.get("/message", (req, res, next) =>
    res
        .json({ message: "Default /api endpoint for airbnb-payment" })
        .status(200)
);

app.use("/", payments);

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
