const validator = require("validator")

const Signupvalidation = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("fill the name");
    }else if (!validator.isEmail(emailId)){
        throw new Error(" Plz enter the coorect email aadress");
    }else if (!validator.isStrongPassword(password)){
        throw new Error("enter the strong password");
    }
}

module.exports = {Signupvalidation};