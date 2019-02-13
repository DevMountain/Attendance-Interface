require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authCtrl = require('./controllers/auth');
const attCtrl = require('./controllers/attendance')

const {
  SERVER_PORT,
  SECRET,
  DB_HOST,
  DB_PASS,
  DB_USER,
  DB_NAME
} = process.env;

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

massive({
    host: DB_HOST,
    password: DB_PASS,
    database: DB_NAME,
    user: DB_USER,
  })
  .then(db => {
    app.set('db', db);
    console.log('connected to db')
  })
  .catch(err => {
    console.log('Error conncting to the DB. This may be caused by not being at a DM location');
    console.log(err);
  });

app.get('/api/auth/callback', authCtrl.callback);
app.get('/api/auth/login', authCtrl.login);

// app.use(authCtrl.isStudent);
// // All endpoints a student can access

// app.use(authCtrl.isStaff);
app.get('/api/getAllCohorts', attCtrl.getAllCohorts)
app.get('/api/getStudent/:id', attCtrl.getStudent)
app.post('/api/getCohort', attCtrl.getCohortAttendance)

app.listen(SERVER_PORT, () => {
  console.log(`${SERVER_PORT} Duck sized horses marching`);
});