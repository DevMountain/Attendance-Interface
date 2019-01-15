require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const fs = require('fs');
const JWT = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const PK = fs.readFileSync(`${__dirname}/../jwt.publickey`);

const { SERVER_PORT, SECRET, DB_HOST, DB_PASS, DB_USER, DB_NAME, JWT_KEY } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SECRET,
  })
);

// massive({
//   host: DB_HOST,
//   password: DB_PASS,
//   database: DB_NAME,
//   user: DB_USER,
// })
//   .then(db => {
//     app.set('db', db);
//     console.log('mad it');
//   })
//   .catch(err => console.log(err));

app.get('/api/auth/callback', (req, res) => {
  JWT.verify(req.cookies.jwtAuth, PK, (err, decoded) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(decoded);
    res.redirect('http://localhost:3000/#/');
  });
});

app.get('/api/test', (req, res) => {
  res.send(200);
});

app.listen(SERVER_PORT, () => {
  console.log(`${SERVER_PORT} Duck sized horses marching`);
});
