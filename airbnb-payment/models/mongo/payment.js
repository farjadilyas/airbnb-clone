var mongoose = require("mongoose");

var paymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    basePrice: Number,
    numNights: Number,
    totalPrice: Number,
    paymentDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["PENDING", "PAID", "CANCELLED", "REFUNDED"],
    },
    cardNo: String,
    cvc: String,
});

mongoose.model("Payment", paymentSchema, "payments");
