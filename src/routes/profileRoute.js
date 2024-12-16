const express = require('express');
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");

const profileRouter = express.Router();

// GET - Profile of the User
profileRouter.get("/profile", userAuth, async (req, res) => {

    try{
      //Get user from request
      const user = req.user;
      res.send(user);
    }catch(err){
      res.status(404).send("ERROR:" + err.message);
    }
  })

// POST - update the profile of the user
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try{
    
  }catch(err){
    res.status(404).send("ERROR:" + err.message);
  }
})

// POST - update the password of the user in profile
profileRouter.post("/profile/password", userAuth, async (req, res) => {

})

// DELETE - delete the user profile
profileRouter.delete("/profile/delete", userAuth, async (req, res) => {

  try{
    const userId = req.user._id.toString();
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }catch(err){
    res.status(404).send("ERROR:" + err.message);
  }
})

module.exports =  profileRouter;