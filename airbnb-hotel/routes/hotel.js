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
      .then(function(hotels) {
        var response = new jsonResponse("ok", 200, hotels);
        res.json(response).status(response.status);
      })
      .catch(next);
//     var response = new jsonResponse("ok", 200, [
//       {
//           "uid":1,
//           "name":"Cottage in Dauphin Island",
//           "img":"https://a0.muscache.com/im/pictures/30c00b46-d66d-4d89-b9ca-3cb2d9d5f461.jpg?im_w=720",
//           "ratings":4.64,
//           "beds":3,
//           "price":383
//       },
//       {
//           "uid":2,
//           "name":"Raelingen in Norway",
//           "img":"https://a0.muscache.com/im/pictures/monet/Select-34444025/original/944d56fa-e9a6-48fb-a9c5-e4e3778042d7?im_w=720",
//           "ratings":4.95,
//           "beds":3,
//           "price":485
//       },
//       {
//           "uid":3,
//           "name":"Twizel in New Zealand",
//           "img":"https://a0.muscache.com/im/pictures/miso/Hosting-47771464/original/e8f6758f-1348-43f6-832a-066a90523068.jpeg?im_w=720",
//           "ratings":5.0,
//           "beds":5,
//           "price":356
//       }
//   ]);
//   res.json(response).status(response.status);
});
  
module.exports = router;
