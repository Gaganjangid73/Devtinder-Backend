const validator = require("validator");

const validateEditProfileData = (req) => {
    const { firstName, lastName, emailId, age, gender } = req.body;

    if (firstName && firstName.trim().length < 2) {
        throw new Error("First name must be at least 2 characters long");
    }

    if (lastName && lastName.trim().length < 2) {
        throw new Error("Last name must be at least 2 characters long");
    }

    if (emailId && !validator.isEmail(emailId)) {
        throw new Error("Please enter a correct email address");
    }

    if (age && (isNaN(age) || parseInt(age) < 18)) {
        throw new Error("Age must be a number and at least 18");
    }

    if (gender && !["male", "female", "other"].includes(gender)) {
        throw new Error("Gender must be male, female, or other");
    }
};

module.exports = { validateEditProfileData };
