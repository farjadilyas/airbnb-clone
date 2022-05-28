var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Booking = mongoose.model("Booking");

/* Default GET JSON for Mongo API */
router.get("/", function(req, res, next) {
    var response = new jsonResponse("Default /api endpoint for users", 200, []);
    res.json(response).status(response.status);
});

router.post("/login", async function(req, res, next) {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        // Checking for existing user
        if (!existingUser) {
            var response = new jsonResponse("User doesn't exist", 404, []);
            return res.json(response).status(response.status);
        }

        // Password check
        const isPasswordCorrect = password === existingUser.password
        if (!isPasswordCorrect) {
            var response = new jsonResponse("Incorrect password", 404, []);
            return res.json(response).status(response.status);
        }

        var response = new jsonResponse("OK", 200, existingUser);
        return res.json(response).status(response.status);

    } catch (error) {
        var response = new jsonResponse(error.message, 500, []);
        return res.json(response).status(response.status);
    }
});

router.post("/signup", async function(req, res, next) {
    const { email, password, firstName, lastName, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        // Checking for existing user
        if (existingUser) {
            var response = new jsonResponse("User Already exists", 404, []);
            return res.json(response).status(response.status);
        }

        // Checking password
        if (password !== confirmPassword) {
            var response = new jsonResponse("Passwords do not match", 404, []);
            return res.json(response).status(response.status);
        }

        const result = await User.create({ email: email, password: password, firstName: firstName, lastName: lastName, imageUrl: "https://bit.ly/3LKyj9m" });
        
        var response = new jsonResponse("OK", 200, result);
        return res.json(response).status(response.status);

    } catch (error) {
        var response = new jsonResponse(error.message, 500, []);
        return res.json(response).status(response.status);
    }
});
  
module.exports = router;
