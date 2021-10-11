const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

app.get('/login', (req, res) => {
    res.sendFile(`${base}/login.html`);
});

app.get('/registration', (req, res) => {
    res.sendFile(`${base}/registration.html`);
});

app.get('/', function (req, res) {
    res.sendFile(`${base}/home.html`);
});

app.get('/deviceInfo', function (req,res) {
    res.sendFile(`${base}/deviceInfo.html`);
});

app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
});

app.get('/test', (req, res) => {
    res.send('test');
});
