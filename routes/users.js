const express = require("express")
const app = express.Router()
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const passport = require("passport");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.get("/", ensureAuthenticated, (req, res) => {
  res.render("user", { user: req.user });
});

app.get('/login', async(req, res) => {
  res.render('login')
})

app.get('/register', async(req, res) => {
  res.render('register')
})


app.post("/register", async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  let errors = [];

  if (!email || !username || !password || !confirm_password) {
    errors.push({ message: "Please fill in all fields" });
  }

  if (password !== confirm_password) {
    errors.push({ message: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    return res.render("register", {
      errors,
      username,
      email,
      password,
      confirm_password,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      errors.push({ message: "Email already registered" });
      return res.render("register", {
        errors,
        username,
        email,
        password,
        confirm_password,
      });
    }

    // Hash password and save new user
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: username,
      email,
      password: hash,
    });

    await newUser.save();

    req.login(newUser, function (err) {
      if (err) throw err;
      return res.redirect("/login"); // or /users/profile etc.
    });

  } catch (err) {
    console.error(err);
    res.render("register", {
      errors: [{ message: "Something went wrong" }],
      username,
      email,
      password,
      confirm_password,
    });
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users",           // where to go if login is successful
    failureRedirect: "/users/login",         // where to go if login fails
    failureFlash: true                       // enable if you're using connect-flash
  })(req, res, next);
});



module.exports = app