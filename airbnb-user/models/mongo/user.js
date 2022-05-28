var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    imageUrl: String,
});

mongoose.model('User', userSchema, 'users');
