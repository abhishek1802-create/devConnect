const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateUserRegister } = require("./utils/validate");
const {userAuth} = require("./middlewares/auth");
const app = express();

app.use(express.json());
app.use(cookieParser());

// POST - save the data of user in database
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, contactNumber } = req.body;

    // Validate the data
    validateUserRegister(req.body);

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 8);

    //Create a new User instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
    });
    await newUser.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(404).send("User creation failed" + err.message);
  }
});

// POST - login the user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      // create JWT Token
      const token = jwt.sign({ _id: user._id.toString() }, "dev@connect1802");
      res.cookie("Token", token);
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(404).send("ERROR:" + err);
  }
});

// GET - Profile of the User
app.get("/profile", userAuth, async (req, res) => {

  try{
    //Get user from request
    const user = req.user;
    res.send(user);
  }catch(err){
    res.status(404).send("ERROR:" + err.message);
  }
})

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database connection failed" + err);
  });
