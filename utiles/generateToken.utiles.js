const jwt = require("jsonwebtoken")


const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });



  module.exports = {
    generateToken
  }