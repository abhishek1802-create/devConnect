const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required: true
    },
    lastName: {
        type : String,
        required: true
    },
    email: {
        type  : String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type  : String,
        required: true,
        minLength: 8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    contactNumber: {
        type : Number,
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 10
    },
    age: {
        type : Number,
        min: 18,
        max:100
    },
    gender: {
        type : [String]
    },
    profilePicture: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISuukVSb_iHDfPAaDKboFWXZVloJW9XXiwGYFab-QwlAYQ3zFsx4fToY9ijcVNU5ieKk&usqp=CAU"
    },
    about: {
        type: String,
        default: "Include Description about yourself..."
    },
    skills: {
        type: [String],
        default: []
    }

}, {timestamps: true})

module.exports = mongoose.model("User", userSchema);