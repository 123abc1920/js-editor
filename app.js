const express = require("express");
var path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/main.html');
});

app.post('/profile', (req, res) => {
    const username = req.body.username;
    const userpass = req.body.userpass;
    res.sendFile(path.join(__dirname + '/views/profile.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.listen(3000);
console.log("Начат");