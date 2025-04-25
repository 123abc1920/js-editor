const express = require("express");
var path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const Database = require('better-sqlite3');
const db = new Database('mydatabase.db');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/main.html');
});

app.post('/profile', (req, res) => {
    const username = req.body.username;
    const userpass = req.body.userpass;

    const stmt = db.prepare("SELECT * FROM users WHERE name=? AND password=?");
    const rows = stmt.all(username, userpass);

    if (rows.length > 0) {
        res.cookie('username', username, { maxAge: 86400000, httpOnly: true });
        const photos = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"];
        res.render('profile', { name: username, photos: photos });
    } else {
        res.redirect(`/login?trying=${true}`);
    }
});

app.post('/reqistr', (req, res) => {
    const username = req.body.username;
    const userpass = req.body.userpass;

    const stmt = db.prepare('INSERT INTO users (name, password) VALUES (?, ?)');
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
});

app.get('/login', (req, res) => {
    var trying = req.query.trying;
    if (!trying) {
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
        res.render('login', { message: 'Неверный логин или пароль' });
    }
});

app.listen(3000);
console.log("Начат");