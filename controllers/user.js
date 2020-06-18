const User = require("./../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("./../config/database");
const _ = require("lodash");
const axios = require("axios");

module.exports.addUser = function (newUser, callback) {
  if (newUser.processFrom == "default") {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          callback(err, null);
        }
        newUser.password = hash;
        newUser.save(null, callback);
      });
    });
  } else {
    newUser.save(null, callback);
  }
};

module.exports.authenticate = function (query, userCredentials, callback) {
  User.findOne(query, async function (err, result) {
    if (result) {
      bcrypt.compare(userCredentials.password, result.password, function (
        err1,
        res1
      ) {
        if (res1) {
          const result_final = result.toJSON();
          delete result_final.password;

          const token = jwt.sign(result_final, database.jwt_secret, {
            expiresIn: 604800
          });
          callback(null, result_final, token);
        } else {
          callback(null, null, null);
        }
      });
    } else {
      callback(null, null, null);
    }
  });
};

module.exports.checkEmail = function (query, callback) {
  User.findOne(query, function (err, result) {
    const queryResult = {
      result: result
    };
    callback(null, queryResult);
  });
};

module.exports.checkGoogleId = function (id, callback) {
  User.findOne({ googleId: id }, function (err, result) {
    callback(null, result);
  });
};

module.exports.checkUsername = function (query, callback) {
  User.findOne(query, function (err, result) {
    const queryResult = {
      result: result
    };
    callback(null, queryResult);
  });
};

module.exports.checkJWT = async function (token, callback) {
  function validate() {
    return new Promise((resolve, reject) => {
      resolve(jwt.verify(token.toString().substring(7), database.jwt_secret));
    });
  }

  try {
    const result = await validate();
    const user = await User.findById(result._id, function (err, result) {
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    });
    await callback(
      null,
      user ? { ...result, validUser: true } : { ...result, validUser: false }
    );
  } catch (err) {
    await callback({ ...err, validUser: false }, null);
  }
};
