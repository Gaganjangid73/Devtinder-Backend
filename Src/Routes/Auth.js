const express = require("express");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    Signupvalidation(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordhash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});





module.exports = authRouter;