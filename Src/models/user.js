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
    photourl:{
        type : String,
        default : "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSe1WLSz9rlUbXgL4j2ZXgPr84gYw5zXH7AB2qAha6MrOdbVp82xnt2jPbRgf0KuzNam-BOMrZd98mQ8r26DVYXDw9fNYHGFMd1-_d4n-dvcA",
    }

});

const User = mongoose.model("User", userSchema);

module.exports = User;
