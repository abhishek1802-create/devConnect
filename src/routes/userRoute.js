const express = require("express");
const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connections");

const userRoute = express.Router();

userRoute.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const recievedRequests = await connectionRequest.find({
      toUserId: user._id.toString(),
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.status(200).json({
      message: "Recieved requests fetched successfully",
      recievedRequests,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

userRoute.get("/user/connection", userAuth, async (req, res) =>{
    try{
        const user = req.user;
        const connections = await connectionRequest.find({
            $or: [
                {fromUserId: user._id.toString(), status: "accepted"},
                {toUserId: user._id.toString(), status: "accepted"}
            ]
        }).populate("fromUserId toUserId", ["firstName", "lastName"]);

        const data = connections.map((connection) => {
            if(connection.fromUserId._id.toString() === user._id.toString()){
                return connection.toUserId;
            }else{
                return connection.fromUserId;
            }
        })

        res.status(200).json({
            message: "Connections fetched successfully",
            data
        })
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = userRoute;
