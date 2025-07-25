// Load environment variables
require('dotenv').config();

// Import express
const express = require("express");
const path = require("path");

const mongoose = require("mongoose");

const passport = require("passport");

const session = require("express-session");

const config = require("./config/database");


var book_routes = require("./routes/library");

var user_routes = require("./routes/users");


mongoose
    .connect(process.env.MONGO_URI)
    .then( () => console.log("MongoDB connected"))
    .catch( (err) => console.error("MongoDB connection error:", err))

// Get database connection
const db = mongoose.connection;

// Check connection
db.once("open", function(){
    console.log("Connected to MongoDB")
})


// Check for DB errors
db.on("error", function (err) {
  console.log("DB Error");
});


const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));

// Passport config
require("./config/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import Book Mongoose schemas
let Book = require("./models/book");

// Load view engine
app.set("/", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Wildcard route to allow user to be
// used in templates
app.get("*", function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

app.use("/users", user_routes);
app.use("/books", book_routes);


app.use("/", async function (req, res) {
  let books = await Book.find({})
    if (!books) {
      res.send("No books found")
    } else {
      // Pass books to index
      res.render("index", {
        books: books,
      });
    }
});

// Set constant for port
module.exports = app;
