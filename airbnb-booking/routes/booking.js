var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var mongoose = require("mongoose");
var Booking = mongoose.model("Booking");

require("../models/mongo/hotel");
require("../models/mongo/user");
var Hotel = mongoose.model("Hotel");
const axios = require("axios");

/* Default GET JSON for Mongo API */
router.get("/", function (req, res, next) {
    var response = new jsonResponse(
        "Default /api endpoint for bookings",
        200,
        []
    );
    res.json(response).status(response.status);
});

function calculateStayDuration(checkIn, checkOut) {
    return Math.trunc(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
}

/* POST Request for creating a new booking */
router.post("/createBooking", function (req, res, next) {
    try {
        var booking = new Booking(req.body);
        console.dir("Creating booking" + booking);

        // Save booking, then create payment
        booking.save().then((booking) => {
            // Find the base price for the hotel that has been booked
            Hotel.findOne({ _id: booking.hotel }).then((hotel) => {
                const basePrice = hotel.price;

                // Calculated derived data to form input for payment entry
                const stayDuration = calculateStayDuration(
                    booking.checkIn,
                    booking.checkOut
                );

                const paymentPayload = {
                    booking: booking._id,
                    basePrice: basePrice,
                    numNights: stayDuration,
                    totalPrice: basePrice * stayDuration,
                    paymentDate: Date.now(),
                    status: "PENDING",
                    cardNo: req.body.cardNo,
                    cvc: req.body.cvc
                };

                // Request payment service to create a payment entry for this booking
                console.log("Creating payment");
                axios
                    .post(process.env.PAYMENT_API + "/pay", paymentPayload)
                    .then((payRes) => {
                        console.log("Payment creation result: " + payRes.data);
                        var response = new jsonResponse("ok", 200, {});
                        res.json(response).status(response.status);
                    });
            });
        });
    } catch (error) {
        var response = new jsonResponse(error, 404, []);
        return res.json(response).status(response.status);
    }
});

/* POST Request for Getting all the bookings */
router.post("/bookings", function (req, res, next) {

    // Find bookings for matching user and fetch more details about the hotel and host
    try {
        Booking.find({ user: req.body.userId })
            .populate({ path: "hotel", model: "Hotel" })
            .populate({
                path: "host",
                model: "User",
                select: "firstName lastName imageUrl",
            })
            .select("-user")
            .lean()
            .then((results) => {
                results = results.map((result) => ({
                    ...result,
                    totalPrice:
                        calculateStayDuration(result.checkIn, result.checkOut) *
                        result.hotel.price,
                }));
                
                var response = new jsonResponse("OK", 200, results);
                return res.json(response).status(response.status);
            });
    } catch (error) {
        var response = new jsonResponse(error, 404, []);
        return res.json(response).status(response.status);
    }
});

const updateBookingStatus = function (bookingId, updates, res) {
    Booking.findByIdAndUpdate(bookingId, updates).then(
        (booking) => {
            console.log(
                "Booking status updated to $bookingStatus: " + bookingId
            );
            var response = new jsonResponse("ok", 200, {});
            res.json(response).status(response.status);
        },
        (error) => {
            console.log(error);
            var response = new jsonResponse("error", 200, {});
            res.json(response).status(response.status);
        }
    );
};

/* POST Request for marking check-in for a booking */
router.post("/checkIn", (req, res, next) => {
    updateBookingStatus(req.body.bookingId, { status: "CHECKED_IN" }, res);
});

/* POST Request for marking check-out for a booking */
router.post("/checkOut", (req, res, next) => {
    updateBookingStatus(req.body.bookingId, { status: "CHECKED_OUT", active: false }, res);
});

router.get("/test", (req, res, next) => {
    axios
    .get(process.env.PAYMENT_API + "/test")
    .then(() => {
        var response = new jsonResponse("Success!", 200, {});
        res.json(response).status(response.status);
    }, (error) => {
        var response = new jsonResponse("Failure!", 200, {});
        res.json(response).status(response.status);
    });
});

module.exports = router;
