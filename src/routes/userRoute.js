const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connections");
const user = require("../models/user");

const userRoute = express.Router();

userRoute.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const recievedRequests = await connectionRequest
      .find({
        toUserId: user._id.toString(),
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName"]);
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

userRoute.get("/user/connection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await connectionRequest
      .find({
        $or: [
          { fromUserId: user._id.toString(), status: "accepted" },
          { toUserId: user._id.toString(), status: "accepted" },
        ],
      })
      .populate("fromUserId toUserId", ["firstName", "lastName"]);

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.toString() === user._id.toString()) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

userRoute.get("/feed", userAuth, async (req, res) => {
  try {
    // user will see all the user cards excpet
    // 1. his own card
    // 2. users who have already accepted the request
    // 3. users who have already sent the request
    // 4. user who ignored the card

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    // Find all the connection requests where the user is either the sender or receiver
    const connections = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id.toString() },
          { toUserId: loggedInUser._id.toString() },
        ],
      })
      .select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connections.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await user
      .find({
        $and: [
          { _id: { $ne: loggedInUser._id.toString() } },
          { _id: { $nin: Array.from(hideUserFromFeed) } },
        ],
      })
      .select(
        "firstName lastName email contactNumber gender profilePicture about skills"
      )
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = userRoute;
