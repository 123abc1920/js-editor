const express = require("express");
var path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const multer = require("multer");
const fs = require('fs');

const Database = require('better-sqlite3');
const db = new Database('mydatabase.db');

app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(multer({ dest: "uploads" }).single("filedata"));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/main.html');
});

app.post('/profile', (req, res) => {
    const username = req.body.username;
    const userpass = req.body.userpass;

    let stmt = db.prepare("SELECT * FROM users WHERE name=? AND password=?");
    let rows = stmt.all(username, userpass);

    if (rows.length > 0) {
        res.cookie('username', username, { maxAge: 86400000 });
        let photos = [];
        let stmt = db.prepare("SELECT * FROM photos WHERE name=?");
        let rows = stmt.all(username);
        rows.forEach(item => {
            photos.push("uploads/" + item.photo);
        });
        let tripl = []
        for (let i = 0; i < photos.length; i++) {
            if (i % 5 == 0) {
                tripl.push([]);
            }
            tripl[tripl.length - 1].push(photos[i]);
        }
        res.render('profile', { name: username, tripl: tripl });
    } else {
        res.redirect(`/login?trying=${true}`);
    }
});

app.post('/reqistr', (req, res) => {
    const username = req.body.username;
    const userpass = req.body.userpass;

    try {
        stmt = db.prepare('INSERT INTO users (name, password) VALUES (?, ?)');
        stmt.run(username, userpass);

        res.send(`
        <form id="autoSubmitForm" action="/profile" method="POST">
            <input type="hidden" name="username" value="${username}">
            <input type="hidden" name="userpass" value="${userpass}">
        </form>
        <script>
            document.getElementById('autoSubmitForm').submit();
        </script>
    `);
    } catch (err) {
        res.redirect(`/login?failed=${true}`);
    }
});

app.get('/login', (req, res) => {
    res.clearCookie('current_file');
    var trying = req.query.trying;
    var failed = req.query.failed;
    if (!trying && !failed) {
        const username = req.cookies.username;
        if (username) {
            const stmt = db.prepare("SELECT * FROM users WHERE name=?");
            const rows = stmt.all(username);
            res.send(`
                <form id="autoSubmitForm" action="/profile" method="POST">
                    <input type="hidden" name="username" value="${username}">
                    <input type="hidden" name="userpass" value="${rows[0].password}">
                </form>
                <script>
                    document.getElementById('autoSubmitForm').submit();
                </script>
            `);
        } else {
            res.render('login', { message: '' });
        }
    } else {
        if (trying){
            res.render('login', { message: 'Неверный логин или пароль' });
        }
        if (failed){
            res.render('login', { message: 'Уже есть пользователь с таким именем' });
        }
    }
});

app.post("/upload", function (req, res, next) {
    const imageData = req.body.img;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

    const date = new Date().toISOString().replace(/[:.-]/g, '');
    const filename = `image_${date}.png`;
    current_file = filename;
    res.cookie('current_file', filename, { maxAge: 86400000 });

    const filePath = path.join(__dirname, 'uploads', filename);
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error(err);
        }
    });

    const username = req.cookies.username;
    const stmt = db.prepare('INSERT INTO photos (name, photo) VALUES (?, ?)');
    stmt.run(username, filename);

    res.redirect("/");
});

app.post("/delete", function (req, res, next) {
    const username = req.cookies.username;
    var stmt = db.prepare('DELETE FROM photos WHERE name=?');
    stmt.run(username);

    stmt = db.prepare('DELETE FROM users WHERE name=?');
    stmt.run(username);

    res.clearCookie("username");
    res.redirect("/login");
});

app.post("/deletephoto", function (req, res) {
    var filename = req.body.namephoto;
    filename = filename.replace("uploads/", "")

    const username = req.cookies.username;
    var stmt = db.prepare('DELETE FROM photos WHERE photo=?');
    stmt.run(filename);

    stmt = db.prepare("SELECT * FROM users WHERE name=?");
    const rows = stmt.all(username);
    res.send(`
                <form id="autoSubmitForm" action="/profile" method="POST">
                    <input type="hidden" name="username" value="${username}">
                    <input type="hidden" name="userpass" value="${rows[0].password}">
                </form>
                <script>
                    document.getElementById('autoSubmitForm').submit();
                </script>
            `);
});

app.post("/openphoto", function (req, res) {
    var filename = req.body.namephoto;
    filename = filename.replace("uploads/", "")
    res.cookie('current_file', filename, { maxAge: 86400000 });
    res.redirect("/");
});

app.listen(3000);
console.log("Начат");