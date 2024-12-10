const validator = require("validator");

const validateUserRegister = (req) => {
    const { firstName, lastName, email, password, age } = req;
    if(!firstName || !lastName){
        throw new Error("Please enter your name");
    }else if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email");
    }else if(!password || password.length < 8){
        throw new Error("Password must be at least 8 characters");
    }else if(!age || age < 18){
        throw new Error("Age must be 18 or above");
    }
}

module.exports = {
    validateUserRegister
}