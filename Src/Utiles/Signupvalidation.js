const validator = require("validator")

const Signupvalidation = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Please fill the name");
    }else if (!validator.isEmail(emailId)){
        throw new Error("Please enter the correct email address");
    }else if (!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
}

module.exports = {Signupvalidation};