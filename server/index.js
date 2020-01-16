const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const session = require("express-session");

const app = express();
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv").config();

const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const request = require("request");

const userInViews = require("./lib/middleware/userInViews");
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const ticketRouter = require('./routes/tickets');

var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:5005/callback"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, 'views')));

app.use(logger("dev"));
app.use(cookieParser());

var sess = {
  secret: process.env.AUTH0_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get("env") === "production") {
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

app.use(session(sess));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(cors());
app.use(express.json());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use(userInViews());
app.use("/", authRouter);
app.use("/", indexRouter);
app.use("/", usersRouter);
app.use('/', ticketRouter);

const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};


/*const { _raw, _json, ...userProfile } = req.user;
  res.render("user", {
    title: "Profile",
    userProfile: userProfile
  });*/


/*app.get("/", secured, (req, res, next) => {
  res.render(__dirname + '/views/index.html');
});*/

app.get("/index", secured, (req, res, next) => {
  res.render(__dirname + "/views/index.html");
  console.log(req.user);
});

app.get("/myProjects", secured, (req, res, next) => {
  res.render(__dirname + "/views/myProjects.html");
});

app.get("/myTickets", secured, (req, res, next) => {
  res.render(__dirname + "/views/myTickets.html");
});

app.get("/tables", secured, (req, res, next) => {
  res.render(__dirname + "/views/tables.html");
});

app.get("/users", secured, (request, response) => {
  con.query(`SELECT u.userRole FROM users u WHERE u.authId = '${request.user.user_id}';`, function(err, data) {
    response.send(data);
  });
});

app.get("/currentUserRole", secured, (req, res, next) => {
  res.send(req.user.app_metadata[0]);
})

app.get("/tickets", secured, (request, response) => {
  con.query(
    "SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.userId = a.submitterId JOIN allprojects p ON p.projectId = a.projectId ORDER BY submitDate DESC, submitTime DESC;",
    function(err, data) {
      response.send(data);
    }
  );
});

app.get("/ticketsopen", secured, (request, response) => {
  con.query(
    'SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.userId = a.submitterId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "Open" ORDER BY submitDate DESC, submitTime DESC;',
    function(err, data) {
      response.send(data);
    }
  );
});

app.get("/ticketsinprogress", secured, (request, response) => {
  con.query(
    'SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.userId = a.submitterId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "In Progress" ORDER BY submitDate DESC, submitTime DESC;',
    function(err, data) {
      response.send(data);
    }
  );
});

app.get("/ticketsresolved", secured, (request, response) => {
  con.query(
    'SELECT p.projectName, u.userName, u.userRole, a.topic, a.issue, a.submitDate, a.submitTime, a.issueStatus FROM alltickets a JOIN users u ON u.userId = a.submitterId JOIN allprojects p ON p.projectId = a.projectId WHERE issueStatus = "Closed" ORDER BY submitDate DESC, submitTime DESC;',
    function(err, data) {
      response.send(data);
    }
  );
});

app.get("/getUsers", secured, (request, response) => {
  getUserIds();
  response.send("ayyy");
});

var getAllUsers = {
  method: "GET",
  url: "https://dev--dymylky.eu.auth0.com/api/v2/users",
  headers: {
    "content-type": "application/json",
    authorization: "Bearer " + process.env.MANAGEMENT_API_ACCESS_TOKEN,
    "cache-control": "no-cache"
  },
  //body: {roles: [process.env.AUTH0_ROLE_NEW_USER]},
  json: true
};

var getUserRole = {
  method: "GET",
  url: `https://dev--dymylky.eu.auth0.com/api/v2/users/INSERT HERE/roles`,
  headers: {
    "content-type": "application/json",
    authorization: "Bearer " + process.env.MANAGEMENT_API_ACCESS_TOKEN,
    "cache-control": "no-cache"
  },
  //body: {roles: [process.env.AUTH0_ROLE_NEW_USER]},
  json: true
};

function getRole(id) {
  request(
    {
      method: "GET",
      url: `https://dev--dymylky.eu.auth0.com/api/v2/users/${id}/roles`,
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + process.env.MANAGEMENT_API_ACCESS_TOKEN,
        "cache-control": "no-cache"
      },
      json: true
    },
    function(error, response, body) {
      if (error) {
        console.log("here is the problem");
        throw new Error(error);
      }
      let userRole = body[0].name;
      try {
        con.query(
          `UPDATE users SET userRole = '${userRole}' WHERE authId = '${id}';`
        );
        console.log("success");
      } catch (err) {
        console.log("error getting roles");
      }
      console.log(body[0].name);
    }
  );
}

function getUserIds() {
  request(getAllUsers, function(error, response, body) {
    if (error) {
      console.log("here is the problem2323");
      throw new Error(error);
    }
    let userInfo = body;
    try {
      con.query("SELECT * FROM users;", function(err, data) {
        let allUsers = data;
        let authIdArray = [];
        userInfo.forEach(user => {
          authIdArray.push(user.user_id);
        })
        userInfo.forEach(user => {
          allUsers.forEach(dbUser => {
            if (!authIdArray.includes(dbUser.authId)){
              try {
                con.query(
                  `INSERT INTO users (username, firstname, lastname, email, authId) VALUES ('${user.username}', '${user.given_name}', '${user.family_name}', '${user.email}', '${user.user_id}');`
                );
              } catch (err) {
                console.log("error inserting user into database");
              }
            }
            if (dbUser.authId === user.user_id) {
              getRole(dbUser.authId);
            }
          });
        });
      });
    } catch (err) {
      console.log("error inserting users");
      console.log(err);
    }
  });
}



app.listen(5005, () => {
  console.log("listening on http://localhost:5005");
});

module.exports = app;
