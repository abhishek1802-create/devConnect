const mongoose = require(`mongoose`);

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhishekbhade2005:newTest1001@abhishek.lj6y4.mongodb.net/devConnect");
}

module.exports = connectDB;