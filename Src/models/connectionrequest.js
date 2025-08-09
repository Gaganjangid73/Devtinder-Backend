const mongoose = require("mongoose");

const connectionRequestSChema = new mongoose.Schema(
  {
    fromuserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    touserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepeted", "rejected"],
        message: `{VALUE} is the incorrect statua type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSChema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromuserId.equals(connectionRequest.touserId)) {
    throw new Error("Cannot send conection request to yourself");
  }
  next();
});

const connectionRequest = new mongoose.model(
  "connectionRequest",
  connectionRequestSChema
);

module.exports = connectionRequest;
