const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRoute");
const profileRouter = require("./routes/profileRoute");
const connectionRouter = require("./routes/connectionRoute");
const userRouter = require("./routes/userRoute");

app.use("/", authRouter, profileRouter, connectionRouter, userRouter);

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
