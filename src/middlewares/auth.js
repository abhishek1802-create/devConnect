const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { Token } = req.cookies;
    if (!Token) {
      throw new Error("Invalid token");
    }

    const decodedData = jwt.verify(Token, "dev@connect1802");
    if (!decodedData) {
      throw new Error("Invalid token");
    }
    const userId = decodedData._id;

    const user = await User.find({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send("ERROR:" + err.message);
  }
};

module.exports = { userAuth };
