const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connections");

const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id.toString();
      const ALLOWED_STATUS = ["interested", "ignored"];

      const isAlowedStatus = ALLOWED_STATUS.includes(req.params.status);

      if (!isAlowedStatus) {
        return res.status(400).send("Invalid status");
      }

      const user = await User.findOne({ _id: req.params.toUserId });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: req.params.toUserId },
          { fromUserId: req.params.toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send("Connection request already sent");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: req.params.toUserId,
        status: req.params.status,
      });

      const data = await connectionRequest.save();

      res.send({
        message: "Connection request sent successfully",
        data: data,
      });
    } catch (err) {
      res.status(404).send("ERROR:" + err.message);
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const ALLOWED_STATUS = ["accepted", "rejected"];
      
      const isAlowedStatus = ALLOWED_STATUS.includes(status);
      if (!isAlowedStatus) {
        return res.status(400).send("Invalid status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id.toString(),
        status: "interested",
      });
      
      if (!connectionRequest){
        return res.status(404).send("Connection request not found");
      }

      connectionRequest.status = status;

      const data =  await connectionRequest.save();

      res.send({
        message: "Connection request reviewed successfully",
        data: data,
      });
    } catch (err) {
      res.status(404).send("ERROR:" + err.message);
    }
  }
);

module.exports = connectionRouter;
