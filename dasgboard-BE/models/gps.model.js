const mongoose = require("mongoose");
const Device = require("./device.model");

const gpsSchema = mongoose.Schema(
  {
    utcTime: {
      type: String,
      required: false,
      trim: true,
    },
    latitude: {
      type: String,
      required: false,
      trim: true,
    },
    longitude: {
      type: String,
      required: false,
      trim: true,
    },
    hdop: {
      type: String,
      required: false,
      trim: true,
    },
    altitude: {
      type: String,
      required: false,
      trim: true,
    },
    fix: {
      type: String,
      required: false,
      trim: true,
    },
    course: {
      type: String,
      required: false,
      trim: true,
    },
    speedKm: {
      type: String,
      required: false,
      trim: true,
    },
    speedKn: {
      type: String,
      required: false,
      trim: true,
    },
    date: {
      type: String,
      required: false,
      trim: true,
    },
    satellites: {
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

const Gps = mongoose.model("gps", gpsSchema, "gps");

module.exports = Gps;
