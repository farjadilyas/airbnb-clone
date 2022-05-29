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

mongoose.Promise = global.Promise;

const connectOptions = {
    useMongoClient: true,
    ssl: true,
    replicaSet: "globaldb"
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
        var Booking = mongoose.model("Booking");

        // Check if the bookings are empty, insert mock data
        Booking.count({}, function (err, c) {
            if (c == 0) {
                console.dir("No bookings found in the database. Loading data.");
                var itemsMock = require("./data/bookings.json");
                Booking.collection.insertMany(itemsMock, function (err, r) {
                    if (err) {
                        console.error("Error inserting bookings: " + err);
                    } else {
                        console.dir("Bookings loaded.");
                    }
                });
            } else {
                console.dir(
                    c +
                        " bookings found in the database. Skipping loading data."
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
var bookings = require("./routes/booking");

app.get("/message", (req, res, next) =>
    res
        .json({ message: "Default /api endpoint for airbnb-booking" })
        .status(200)
);

app.use("/", bookings);

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
