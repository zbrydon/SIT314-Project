const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: Boolean,
    switches:Array
}));