const mongoose = require('mongoose');
module.exports = mongoose.model('Light', new mongoose.Schema({
ID: Number,
state: Boolean,
brightness: Number,
colour: Object
}));