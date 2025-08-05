const express = require("express");
const App = express();

// Home route
App.get("/", (req, res) => {
    res.send("Welcome to my homepage");
});

// About route
App.get("/about", (req, res) => {
    res.send("Hey, My name is Gagan");
});

// Contact route
App.get("/contact", (req, res) => {
    res.send("Contact me at gagan@example.com");
});

// Start server
App.listen(3000, () => {
    console.log("Server is running on port 3000");
});
