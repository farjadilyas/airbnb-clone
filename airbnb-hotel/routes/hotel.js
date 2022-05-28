var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var mongoose = require("mongoose");
var Hotel = mongoose.model("Hotel");

/* Default GET JSON for Mongo API */
router.get("/", function(req, res, next) {
    var response = new jsonResponse("Default /api endpoint for hotels", 200, []);
    res.json(response).status(response.status);
});

/* GET Request for Getting all the hotels */
router.get("/hotels", function(req, res, next) {
    Hotel.find({})
      .select('name img ratings beds price')
      .then(function(hotels) {
        var response = new jsonResponse("OK", 200, hotels);
        res.json(response).status(response.status);
      })
      .catch(next);
});

router.post("/hotel", function(req, res, next) {
    const { hotelID } = req.body;
    try {
      Hotel.findById(hotelID)
          .populate({
            path: "host",
            model: "User",
            select: "firstName lastName imageUrl"
          })
          .then((result) => {
            var response = new jsonResponse("OK", 200, result);
            return res.json(response).status(response.status);
          })
    } catch (error) {
      var response = new jsonResponse(error, 404, []);
      return res.json(response).status(response.status);
    }
});
  
module.exports = router;
