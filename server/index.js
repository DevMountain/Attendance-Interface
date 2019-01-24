require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const { SERVER_PORT, SECRET, DB_HOST, DB_PASS, DB_USER, DB_NAME } = process.env;

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
console.log(DB_HOST, DB_PASS, DB_NAME, DB_USER);
massive({
  host: DB_HOST,
  password: DB_PASS,
  database: DB_NAME,
  user: DB_USER,
}).then(db => {
  app.set('db', db);
});

app.get('/api/auth/callback', (req, res) => {
  const publicKey = fs.readFileSync(`${__dirname}/../jwt_public_key`);
  const x = jwt.verify(req.cookies.jwtAuth, publicKey);
  console.log(x);
  res.redirect('http://localhost:3000');
});

app.listen(SERVER_PORT, () => {
  console.log(`${SERVER_PORT} Duck sized horses marching`);
});
