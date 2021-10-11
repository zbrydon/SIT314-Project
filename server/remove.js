const mongoose = require('mongoose');
const Light = mongoose.model('Light', new mongoose.Schema({
ID: Number,
state: Boolean,
brightness: Number,
colour: Object
}));

const Switch = mongoose.model('Switch', new mongoose.Schema({
    ID: Number,
    state: Boolean,
    brightness: Number,
    colour: Object,
    lightsIDs: Array
    }));

mongoose.connect("mongodb+srv://zbrydon:zbrydon@sit209.dss4j.mongodb.net/sit209", { useNewUrlParser: true, useUnifiedTopology: true });

Light.deleteMany({});
Switch.deleteMany({});