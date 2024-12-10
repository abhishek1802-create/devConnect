const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateUserRegister } = require("./utils/validate");
const app = express();

app.use(express.json());

// GET - User on the specific emailId
// "findOne" : extract out only specific one user with matching email from the database
// "find" : extract out all users with matching email from the database

app.get("/user", async (req, res) => {
  const emailId = req.body.email;

  try {
    const user = await User.find({ email: emailId });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch {
    res.status(404).send("something went wrong !!!");
  }
});

// GET - All users for the feed Page
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(400).send("No users found");
    } else {
      res.send(users);
    }
  } catch {
    res.status(404).send("something went wrong !!!");
  }
});

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
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(404).send("ERROR:" + err);
  }
});

// DELETE - delete the user by email from database
app.delete("/user", async (req, res) => {
  const emailId = req.body.email;

  try {
    const deletedUser = await User.findOneAndDelete({ email: emailId });
    console.log(deletedUser);
    res.send("User deleted successfully");
  } catch {
    res.status(404).send("something went wrong !!!");
  }
});

// PATCH - update the user by email from database
app.patch("/user/:emailId", async (req, res) => {
  const emailId = req.params.emailId;
  const newData = req.body;
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "about",
      "skills",
      "profilePicture",
      "contactNumber",
    ];
    const isUpdateAllowed = Object.keys(newData).every((data) =>
      ALLOWED_UPDATES.includes(data)
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid update request");
    }

    if (newData.skills && newData.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    if (newData.contactNumber && newData.contactNumber.length !== 10) {
      throw new Error("Contact number must be 10 digits");
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: emailId },
      newData,
      { runValidators: true }
    );
    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("something went wrong !!!" + err);
  }
});

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
