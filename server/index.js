const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv').config();

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
  con.query('SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.project = a.projectId JOIN allprojects p ON p.projectId = a.projectId;', function (err, data) {
    response.send(data);
  });
});

app.get('/ticketsopen', (request, response) => {
  con.query('SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.project = a.projectId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "Open";', function (err, data) {
    response.send(data);
  });
});

app.get('/ticketsinprogress', (request, response) => {
  con.query('SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.project = a.projectId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "In Progress";', function (err, data) {
    response.send(data);
  });
});

app.get('/ticketsresolved', (request, response) => {
  con.query('SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.project = a.projectId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "Closed";', function (err, data) {
    response.send(data);
  });
});

function isValidTicket(ticket){
  return ticket.topic && ticket.topic.toString().trim() != '' &&
          ticket.issue && ticket.issue.toString().trim() != '';
}


app.use(rateLimit({
  windowMs: 15 * 1000,
  max: 1
}));

app.post('/tickets', (req, res) => {
  if (isValidTicket(req.body)) {
    const ticket = {
      submitterId: req.body.submitterId.toString(),
      projectId: req.body.projectId.toString(),
      topic: req.body.topic.toString(),
      issue: req.body.issue.toString(),
      date: req.body.date.toString(),
      time: req.body.time.toString()
    };
    try{
    con.query(`INSERT INTO alltickets (submitterId, topic, issue, submitDate, submitTime) VALUES (${ticket.submitterId}, '${ticket.topic}', '${ticket.issue}', '${ticket.date}', '${ticket.time}');`);
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