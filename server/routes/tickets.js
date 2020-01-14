var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const dotenv = require("dotenv").config();

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

router.post("/tickets", (req, res) => {
  console.log(req.body);
  console.log(req.user.user_id);
  let usId = req.user.user_id;
  if (isValidTicket(req.body)) {
    try {
      con.query(`SELECT userId FROM users WHERE authId = '${usId}';`, function (err, data){
        let dbUserId = data;
        console.log(dbUserId);
        let ticket = {
          submitterId: dbUserId[0].userId,
          projectId: req.body.projectId.toString(),
          topic: req.body.topic.toString(),
          issue: req.body.issue.toString(),
          date: req.body.date.toString(),
          time: req.body.time.toString()
        };
        console.log(ticket);
        try {
          console.log(ticket.submitterId);
          con.query(
            `INSERT INTO alltickets (submitterId, topic, issue, submitDate, submitTime) VALUES (${ticket.submitterId}, '${ticket.topic}', '${ticket.issue}', '${ticket.date}', '${ticket.time}');`
          );
          res.send("Successfully posted ticket!");
        } catch (err) {
          console.log("there has been an error");
        }
        console.log(ticket);
      })
    } catch(err){
     console.log(err);
    }
    
  } else {
    res.status(422);
    res.json({
      message: "Failed to post ticket"
    });
  }
});

function isValidTicket(ticket) {
  return (
    ticket.topic &&
    ticket.topic.toString().trim() != "" &&
    ticket.issue &&
    ticket.issue.toString().trim() != ""
  );
}

module.exports = router;