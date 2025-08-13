const JWT = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
   return res.status(401).send("please login.");
    }

    const data = JWT.verify(token, "uhurvhufrbv");
    const {_id} = data;
    const user =  await User.findById(_id);
    if (!user) {
      throw new Error("user was not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
};

module.exports = userAuth ;
