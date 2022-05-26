var mongoose = require('mongoose');

var hotelSchema = new mongoose.Schema({
    uid: Number,
    name: String,
    img: String,
    ratings: Number,
    beds: Number,
    price: Number,
});

mongoose.model('Hotel', hotelSchema, 'hotels');
