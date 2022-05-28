var mongoose = require("mongoose");

var numGuestsSchema = new mongoose.Schema({
    adults: Number,
    children: Number,
    infants: Number,
    pets: Number,
});

var bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    checkIn: { type: Date, default: Date.now },
    checkOut: { type: Date, default: Date.now },
    numGuests: numGuestsSchema,
    active: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ["CREATED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"],
        default: "CREATED"
    }
});

mongoose.model("Booking", bookingSchema, "bookings");
