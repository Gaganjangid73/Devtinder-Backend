const mongoose = require("mongoose");

const ConnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://GaganJangid:Gagan123@devtinder.jmz59y2.mongodb.net/Devtinder"
  );
};

module.exports= ConnectDB;