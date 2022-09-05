const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const {rateLimiterAll, rateLimiterCreate} = require("./middlewares/rateLimiter");

const PORT = process.env.PORT || 3000;
const app = express();

// Routes
const residentsRoutes = require("./routes/residents");
const agenciesRoutes = require("./routes/publicAgencies");
const loginRoutes = require("./routes/login");
const commentsRoutes = require("./routes/comments");
const categoriesRoutes = require("./routes/categories");
const DenunciationsRoutes = require("./routes/denunciations");

// MongoDB connection
const url = process.env.URI_MONGO_DB_ALERTA_BRUMADINHO;
const options = { useNewUrlParser: true , useUnifiedTopology: true};

mongoose.connect(url, options);
mongoose.set("useCreateIndex", true);

mongoose.connection.on("error", err => {
  console.log("Database connection error: " + err);
});

mongoose.connection.on("disconected", () => {
  console.log("Application disconnected from the database!");
});

mongoose.connection.on("connected", () => {
  console.log("Application connected to the database!");
});

app.use(cors({ credentials: true, origin: "*" }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour

// Rate Limiter
app.use("/categories", rateLimiterAll);
app.use("/comments", rateLimiterAll);
app.use("/residents", rateLimiterAll);
app.use("/publicAgencies", rateLimiterAll);
app.use('/denunciations/list', rateLimiterAll);
app.use('/denunciations/fromSearchId', rateLimiterAll);
app.use('/denunciations/fromCity', rateLimiterAll);
app.use('/denunciations/fromEmail', rateLimiterAll);
app.use('/denunciations/fromStatus', rateLimiterAll);
app.use('/denunciations/likes', rateLimiterAll);
app.use('/denunciations/comment', rateLimiterAll);
app.use('/denunciations/removeComment', rateLimiterAll);
app.use('/denunciations/like', rateLimiterAll);
app.use('/denunciations/removeLike', rateLimiterAll);
app.use('/denunciations/auditor', rateLimiterAll);
app.use('/denunciations/publisher', rateLimiterAll);
app.use('/denunciations/delete', rateLimiterAll);
app.use("/denunciations/create", rateLimiterCreate);

// Express Security
app.use(helmet());
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true,
    httpOnly: true,
    expires: expiryDate
  },
  store: MongoStore.create({
    mongoUrl: process.env.URI_MONGO_DB_SESSIONS,
    mongoOptions: options
  })
}));

// Express content type
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Using routes
app.use("/residents", residentsRoutes);
app.use("/publicAgencies", agenciesRoutes);
app.use("/login", loginRoutes);
app.use("/comments", commentsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/denunciations", DenunciationsRoutes);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
