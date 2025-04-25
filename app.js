const express = require("express");
var path = require('path');
const app = express();
const Database = require('better-sqlite3');
const db = new Database('mydatabase.db');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

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
        res.sendFile(path.join(__dirname + '/views/profile.html'));
    } else {
        res.redirect(`/login?trying=${true}`)
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
        res.render('login', { message: '' });
    } else {
        res.render('login', { message: 'Неверный логин или пароль' });
    }
});

app.listen(3000);
console.log("Начат");