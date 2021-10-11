const mongoose = require('mongoose');
module.exports = mongoose.model('Switch', new mongoose.Schema({
ID: Number,
state: Boolean,
brightness: Number,
colour: Object,
lightsIDs: Array
}));