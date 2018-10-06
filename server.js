const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

const port = process.env.PORT || 5000;

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
//const reviews = require("./routes/api/reviews");

// DB Config
const db = require("./config/keys").mongoURI;

app.get("/", (req, res) => res.send("Hello World"));

app.listen(port, () => console.log(`Server running on ${port}`));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
