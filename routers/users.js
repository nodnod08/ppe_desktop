const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("./../models/Users");
const passport = require("passport");
const userController = require("./../controllers/user");
const database = require("./../config/database");
const axios = require("axios");

("use strict");

router.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    fullname: req.body.firstname + " " + req.body.lastname,
    username: req.body.username,
    password: req.body.password,
    usertype: "user",
    processFrom: "default"
  });

  userController.addUser(newUser, (err, result) => {
    if (err) {
      res.json({ success: false, message: "Failed to register new user" });
    } else {
      res.json({ success: true, message: "Successfuly registered" });
    }
  });
});

router.post("/checkUserFromSocial", (req, res) => {
  userController.checkGoogleId(req.body.googleId, (err, result) => {
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      fullname: req.body.firstname + " " + req.body.lastname,
      email: req.body.email,
      username: req.body.firstname,
      usertype: "user",
      img: req.body.img,
      processFrom: "social",
      googleId: req.body.googleId
    });

    if (result) {
      delete result.googleId;
    } else {
      delete newUser.googleId;
    }

    const token = jwt.sign(
      result ? result.toJSON() : newUser.toJSON(),
      database.jwt_secret,
      {
        expiresIn: 604800
      }
    );
    if (result) {
      res.json({
        success: true,
        message: "Already registered",
        token: "Bearer " + token,
        user: result
      });
    } else {
      userController.addUser(newUser, (err, result) => {
        if (err) {
          res.json({ success: false, message: "Failed to register new user" });
        } else {
          delete newUser.googleId;
          res.json({
            success: true,
            message: "Successfuly registered",
            token: "Bearer " + token,
            user: newUser
          });
        }
      });
    }
  });
});

router.post("/authenticate", (req, res) => {
  const userCredentials = {
    email: req.body.email,
    password: req.body.password
  };
  const query = { email: userCredentials.email };

  userController.authenticate(query, userCredentials, (err, result, token) => {
    if (result) {
      res.send({
        success: true,
        message: "Successfuly logged in",
        token: "Bearer " + token,
        user: {
          _id: result._id,
          firstname: result.firstname,
          lastname: result.lastname,
          fullname: result.fullname,
          email: result.email,
          username: result.username,
          usertype: result.usertype,
          processFrom: result.processFrom
        }
      });
    } else {
      res.send({ success: false, message: "Username or password incorrect" });
    }
  });
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send(req.user);
  }
);

router.post("/email", (req, res) => {
  const query = { email: req.body.email };

  userController.checkEmail(query, (err, result) => {
    res.send(result);
  });
});

router.post("/username", (req, res, next) => {
  const query = { username: req.body.username };

  userController.checkUsername(query, (err, result) => {
    res.send(result);
  });
});

router.post("/checkJWT", (req, res) => {
  const payload = JSON.parse(req.body.payloads);

  userController.checkJWT(payload.token, (err, result) => {
    res.send({
      result: err ? err : { ...result, message: "jwt not expired" }
    });
  });
});

router.post("/validateRecaptcha", (req, res) => {
  const payload = {
    response: req.body.response
  };

  axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LfhZtoUAAAAANzt0WdfpPSnW4u_iyp-EaLilSBW&response=${payload.response}`
    )
    .then((response) => {
      res.send({ result: response.data });
    });
});

module.exports = router;
