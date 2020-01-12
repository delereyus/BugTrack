const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const session = require('express-session');

const app = express();
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv').config();

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const userInViews = require('./lib/middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:5500/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

var sess = {
  secret: process.env.AUTH0_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

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

passport.use(strategy);

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());

app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


app.get('/', (request, response) => {
  response.json({
    message: 'Hello Worldayyyyyyy'
  });
});

app.get('/tickets', (request, response) => {
  con.query('SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.project = a.projectId JOIN allprojects p ON p.projectId = a.projectId ORDER BY submitDate DESC, submitTime DESC;', function (err, data) {
    response.send(data);
  });
});

app.get('/ticketsopen', (request, response) => {
  con.query('SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.project = a.projectId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "Open" ORDER BY submitDate DESC, submitTime DESC;', function (err, data) {
    response.send(data);
  });
});

app.get('/ticketsinprogress', (request, response) => {
  con.query('SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.project = a.projectId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "In Progress" ORDER BY submitDate DESC, submitTime DESC;', function (err, data) {
    response.send(data);
  });
});

app.get('/ticketsresolved', (request, response) => {
  con.query('SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.project = a.projectId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "Closed" ORDER BY submitDate DESC, submitTime DESC;', function (err, data) {
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