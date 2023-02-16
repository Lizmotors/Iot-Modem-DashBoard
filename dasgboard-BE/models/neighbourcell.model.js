const mongoose = require("mongoose");
const Device = require("./device.model");

const neighbourcellSchema = mongoose.Schema(
  {
    topic: {
      type: String,
      required: false,
      trim: true,
    },
    acessTech: {
      type: String,
      required: false,
      trim: true,
    },
    earfc: {
      type: String,
      required: false,
      trim: true,
    },
    pcId: {
      type: String,
      required: false,
      trim: true,
    },
    rsrq: {
      type: String,
      required: false,
      trim: true,
    },
    rsrp: {
      type: String,
      required: false,
      trim: true,
    },
    rssi: {
      type: String,
      required: false,
      trim: true,
    },
    sinr: {
      type: String,
      required: false,
      trim: true,
    },
    srxlev: {
      type: String,
      required: false,
      trim: true,
    },
    cellReselPriority: {
      type: String,
      required: false,
      trim: true,
    },
    sNonIntraSearc: {
      type: String,
      required: false,
      trim: true,
    },
    threshServLow: {
      type: String,
      required: false,
      trim: true,
    },
    sIntraSearch: {
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

const Neighbourcell = mongoose.model(
  "neighbourcell",
  neighbourcellSchema,
  "neighbourcell"
);

module.exports = Neighbourcell;
