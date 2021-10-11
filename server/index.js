const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')

const Switch = require('./models/switch')
const Light = require('./models/light')
const User = require('./models/user')

mongoose.connect("mongodb+srv://zbrydon:zbrydon@sit209.dss4j.mongodb.net/sit209", { useNewUrlParser: true, useUnifiedTopology: true });

const EDGE_DEVICE_URL = 'http://localhost:4000';


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
const port = process.env.PORT || 5000;

app.use(express.static('public'));
 
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});



app.get('/test', (req, res) => {
    res.send('The API is working!');
});

function getUser(req, res, next){
    User.findOne({ username: req.query.user }, (err,result) => {
        if(err){
            return res.status(400).send({
                success: false,
                message: err
            });
        }else{
            res.locals.user = result;
            next();
        }})
};
function getSwitches(req, res, next){
    const switches = res.locals.user.switches;
    _switches = [];

    let get = new Promise((resolve, reject) => {
        switches.forEach((_switch, index, array) => {
            Switch.findOne({ID: _switch,}, (err, result) => {
                if(err){
                    return res.status(400).send({
                        success: false,
                        message: err
                    }); 
                }else{
                    _switches.push(result);
                    if (index === array.length -1) resolve();
                }  
            })
        });
    });

    get.then(() => {
        res.locals._switches = _switches;
        next();
    })
    
};

app.get('/device', (req, res) => {
    Switch.findOne({ID: req.query.deviceId,}, (err, result) => {
        if(err){
            return res.status(400).send({
                success: false,
                message: err}); 
        }else{
            return res.status(200).send({
                success: true,
                message: 'Switch Displayed',
                switch: result
            })
        }
        
    });
})

app.get('/devices', getUser, getSwitches, (req, res) => {
    return res.status(200).send({
        success: true,
        message: 'Switches Displayed',
        switches: res.locals._switches
    })
});

app.post('/authenticate', (req, res) => {
    const { entered_username, entered_password } = req.body;
    User.findOne({ username: entered_username }, (err, user) => {
        if (err == true) {
            return res.send(err);
        } else if (user === null) {
            return res.send("User does not exist");
        } else if (user.password !== entered_password) {
            return res.send("Incorrect password");
        } else if (user !== null && user.password === entered_password) {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: user.isAdmin
            });
        }
    });
});

app.post('/registration', (req, res) => {
    const { entered_username, entered_password, isAdmin } = req.body;
    User.findOne({ username: entered_username }, (err, user) => {
        if (err == true) {
            return res.send(err);
        } else if (user !== null) {
            return res.send("User already exist");
        } else {
            const newUser = new User({
                username: entered_username,
                password: entered_password,
                isAdmin
            });
            newUser.save(err => {
                return err
                    ? res.send(err) :
                    res.json({
                        success: true,
                        message: 'Created new user'
                    });
            });
        }
    });
});

app.post('/updateSwitch', (req, res) => {
    //console.log(req.body)
    console.log(req.body.client)
    let _switch = req.body._switch
    if(req.body.client){
        axios.post(`${EDGE_DEVICE_URL}/updateSwitch`, {_switch}).then(res => {
            //console.log(`statusCode: ${res.status}`)
        })
        .catch(error => {
            console.error(error)
        }) 
    }
    
    Switch.findOne({ID:req.body._switch.ID}, (err, result) => {
        if(err){
            return res.status(400).send({
                success: false,
                message: err
            });
        } else if(!result){
            const _switch = new Switch({
                ID: req.body._switch.ID,
                state: req.body._switch.state,
                brightness: req.body._switch.brightness,
                colour: req.body._switch.colour,
                lightsIDs: req.body._switch.lightsIDs
            })
            _switch.save((err) => {
                if (err) {
                    console.log(err);
                } 
            })
            return res.status(200).send({
                success: true,
                message: 'Success!'
            })
        } else{
            Switch.findOneAndUpdate(
                {ID: req.body._switch.ID},
                {$set:{
                    state: req.body._switch.state,
                    brightness: req.body._switch.brightness,
                    colour: req.body._switch.colour,
                    lightsIDs: req.body._switch.lightsIDs
                }},
                {returnNewDocument:true,useFindAndModify:false}, (err) => {
                    if(err){
                        return res.status(400).send({
                            success: false,
                            message: err
                        });
                    }else{
                        return res.status(200).send({
                            success: true,
                            message: 'Success!'
                        })
                    }
                })
        }
    })
    
    
});

app.post('/updateLight', (req, res) => {
    //console.log(req.body)
    let light = req.body.light
    console.log(req.body.client)
    if(req.body.client){
        axios.post(`${EDGE_DEVICE_URL}/updateLight`, {light}).then(res => {
            //console.log(`statusCode: ${res.status}`)
        })
        .catch(error => {
            console.error(error)
        }) 
    }
    Light.findOne({ID:req.body.light.ID}, (err, result) => {
        if(err){
            return res.status(400).send({
                success: false,
                message: err
            });
        } else if(!result){
            const light = new Light({
                ID: req.body.light.ID,
                state: req.body.light.state,
                brightness: req.body.light.brightness,
                colour: req.body.light.colour,
                lightsIDs: req.body.light.lightsIDs
            })
            light.save((err) => {
                if (err) {
                    console.log(err);
                } 
            })
            return res.status(200).send({
                success: true,
                message: 'Success!'
            })
        } else{
            Light.findOneAndUpdate(
                {ID: req.body.light.ID},
                {$set:{
                    state: req.body.light.state,
                    brightness: req.body.light.brightness,
                    colour: req.body.light.colour,
                    lightsIDs: req.body.light.lightsIDs
                }},
                {returnNewDocument:true,useFindAndModify:false}, (err) => {
                    if(err){
                        return res.status(400).send({
                            success: false,
                            message: err
                        });
                    }else{
                        return res.status(200).send({
                            success: true,
                            message: 'Success!'
                        })
                    }
                })
        }
    })
    
    
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});