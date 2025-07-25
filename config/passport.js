const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  // Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid credentials" });
        }
      } catch (err) {
        console.error(err);
        return done(err);
      }
    })
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec();

      if (!user) {
        return done(null, false, { message: "User not found during deserialization" });
      }

      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });
};
