const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv').config();

let userIdValue = 1;

var con = mysql.createConnection({
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(cors());
app.use(express.json());



app.get('/', (request, response) => {
  response.json({
    message: 'Hello Worldayyyyyyy'
  });
});

app.get('/tickets', (request, response) => {
  con.query('select * from alltickets where status="Open";', function (err, data) {
    response.send(data);
  });
});

function isValidTicket(ticket){
  return ticket.topic && ticket.topic.toString().trim() != '' &&
          ticket.issue && ticket.issue.toString().trim() != '' &&
          ticket.fromUser && ticket.fromUser.toString().trim() != '';
}


app.use(rateLimit({
  windowMs: 15 * 1000,
  max: 1
}));

app.post('/tickets', (req, res) => {
  if (isValidTicket(req.body)) {
    const ticket = {
      from: req.body.fromUser.toString(),
      topic: req.body.topic.toString(),
      issue: req.body.issue.toString()
    };
    let date = getDate();
    let time = getTime();
    try{
    con.query(`INSERT INTO alltickets (userId, topic, issue, date, time) VALUES (${userIdValue}, '${ticket.topic}', '${ticket.issue}', '${date}', '${time}');`);
    res.send('Successfully posted ticket!')
    } catch(err){
      console.log('there has been an error');
    }
    console.log(ticket);
  } else {
    res.status(422);
    res.json({
      message: 'Failed to post ticket'
    });
  }
});

app.listen(5005, () => {
  console.log('listening on http://localhost:5005');
});

function getDate() {
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    checkDate(today.getMonth()) +
    (today.getMonth() + 1) +
    "-" +
    checkDate(today.getDate()) +
    today.getDate();
  return date;
}

function getTime() {
  let today = new Date();
  let time =
  checkDate(today.getHours()) +
    today.getHours() +
    ":" +
    checkDate(today.getMinutes()) +
    today.getMinutes() +
    ":" +
    checkDate(today.getSeconds()) +
    today.getSeconds();
  return time;
}

function checkDate(dateOrTime) {
  if (dateOrTime < 10) {
    return "0";
  } else return "";
}