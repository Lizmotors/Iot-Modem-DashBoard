const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: false,
      trim: true,
    },
    revision: {
      type: String,
      required: false,
      trim: true,
    },
    imei: {
      type: String,
      required: false,
      trim: true,
    },
    imsi: {
      type: String,
      required: false,
      trim: true,
    },
    qccid: {
      type: String,
      required: false,
      trim: true,
    },
    ipAddress: {
      type: String,
      required: false,
      trim: true,
    },
    byteSend: {
      type: String,
      required: false,
      trim: true,
    },
    byteReceive: {
      type: String,
      required: false,
      trim: true,
    },
    pdp: {
      type: Array,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model("device", deviceSchema, "device");

module.exports = Device;
