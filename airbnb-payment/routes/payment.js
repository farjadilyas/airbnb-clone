var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var mongoose = require("mongoose");
var Payment = mongoose.model("Payment");

/* Default GET JSON for Mongo API */
router.get("/", function (req, res, next) {
    var response = new jsonResponse(
        "Default /api endpoint for bookings",
        200,
        []
    );
    res.json(response).status(response.status);
});

/* POST Request for creating a new booking */
router.post("/pay", async function (req, res, next) {
    var params = req.body;
    params["paymentDate"] = Date.now();
    params["status"] = "PAID";
    var payment = new Payment(params);
    console.dir("Creating payment" + payment);
    await payment.save();
    var response = new jsonResponse("ok", 200, {});
    res.json(response).status(response.status);
});

/* POST Request to get a payment against a booking */
router.post("/fetchPayment", function (req, res, next) {
    Payment.find({ booking: req.body.bookingId })
        .then(function (payment) {
            var response = new jsonResponse("ok", 200, payment);
            res.json(response).status(response.status);
        })
        .catch(next);
});

router.get("/test", function (req, res, next) {
    var response = new jsonResponse("OK", 200, {});
    res.json(response).status(response.status);
})

module.exports = router;
