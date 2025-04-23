const express = require("express");
var path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/main.html');
});

app.listen(3000);
console.log("Начат");