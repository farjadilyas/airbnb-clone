var mongoose = require('mongoose');

var hotelSchema = new mongoose.Schema({
    uid: Number,
    name: String,
    img: String,
    ratings: Number,
    beds: Number,
    price: Number,
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: String,
    address: String,
    images: [String],
    location: [Number],
});

mongoose.model('Hotel', hotelSchema, 'hotels');
