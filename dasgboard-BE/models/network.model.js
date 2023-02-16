const mongoose = require("mongoose");
const Device = require("./device.model");

const networkSchema = mongoose.Schema(
  {
    accessTech: {
      type: String,
      required: false,
      trim: true,
    },
    operator: {
      type: String,
      required: false,
      trim: true,
    },
    band: {
      type: String,
      required: false,
      trim: true,
    },
    channel: {
      type: String,
      required: false,
      trim: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: Device,
    },
  },
  {
    timestamps: true,
  }
);

const Network = mongoose.model("network", networkSchema, "network");

module.exports = Network;
