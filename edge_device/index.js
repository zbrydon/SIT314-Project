const axios = require('axios')
const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const express = require('express')

const SERVER_URL = 'http://localhost:5000';


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
const port = process.env.PORT || 4000;

app.use(express.static('public'));
 
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});


// Topics
// Subscribe
let switchUpdate = "/switchUpdate"
let serverUpdate = "/serverUpdate"
let motionUpdate = "/motionUpdate"

// Publish
let updateSwitch = "/updateSwitch"
let updateLight = "/updateLight"
let updateServer = "/updateServer"

client.on('connect', () => {
    console.log('mqtt connected');
});

client.subscribe(switchUpdate);
client.subscribe(serverUpdate);
//client.subscribe(motionUpdate);


client.on('message', (topic, message) => {
    switch (topic) {
        case switchUpdate:
            
            _switch = JSON.parse(message)
            
            console.log(JSON.stringify(_switch))

            _switch.lightsIDs.forEach(id => {
                light = {
                    'ID': id,
                    'state': _switch.state,
                    'brightness': _switch.brightness,
                    'colour': {'red': _switch.colour.red, 'green': _switch.colour.green, 'blue': _switch.colour.blue}
                }
                msg = JSON.stringify(light)
                client.publish(updateLight,msg)
                axios.post(`${SERVER_URL}/updateLight`, {
                    light
                })
                .then(res => {
                    console.log(`statusCode: ${res.status}`)
                })
                .catch(error => {
                    console.error(error)
                })
            });
            axios.post(`${SERVER_URL}/updateSwitch`, {
                    _switch
                })
                .then(res => {
                    console.log(`statusCode: ${res.status}`)
                })
                .catch(error => {
                    console.error(error)
                })

            break;
        case serverUpdate:
        
            break;
        case motionUpdate:
        
            break;
        default:
            break;
    }
})

app.post('/updateSwitch' , (req, res) => {
    console.log(req.body._switch)
    msg = JSON.stringify(req.body._switch)
    client.publish(updateSwitch,msg)
})

app.post('/updateLight' , (req, res) => {
    console.log(req.body.light)
    msg = JSON.stringify(req.body.light)
    client.publish(updateLight,msg)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


// var _switch = {
//     'ID': 1,
//     'state': true,
//     'brightness': 0.4,
//     'colour':  {'red': 53, 'green': 63, 'blue': 135},
//     'lightsIDs':[9,8,7,6,5,4,4,7,2,7,3,42,654]
// }
// var message = JSON.stringify(_switch)
// client.publish(updateSwitch, message)