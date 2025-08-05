const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName :{
        type: String,
    },
    lastName :{
        type: String,
    },
    emailId :{
        type:String,
        unique: true,
        required: true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required : true,
    },
    age: {
        type:String,
        min:18,
    },
    gender: {
        type:String,
        validate(value){
            if(!["male", "female" ,"Others"].includes(value)){
                throw new Error("invalid gender");
            }
        }
    },

});

const User = mongoose.model("User", userSchema);

module.exports = User;
