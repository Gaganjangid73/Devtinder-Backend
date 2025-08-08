const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastName :{
        type: String,
        required: true,
        trim: true,
        minlength: 2
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
        type: Number,
        min: 18,
        validate: {
            validator: function(v) {
                return v >= 18;
            },
            message: 'Age must be at least 18'
        }
    },
    gender: {
        type: String,
        enum: ["male", "female", "Others"],
        required: true
    },

});

const User = mongoose.model("User", userSchema);

module.exports = User;
