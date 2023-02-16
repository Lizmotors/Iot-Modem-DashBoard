const mongoose = require("mongoose");
const Device = require("./device.model");

const servingcellSchema = mongoose.Schema(
  {
    topic: {
      type: String,
      required: false,
      trim: true,
    },
    connectionState: {
      type: String,
      required: false,
      trim: true,
    },
    acessTech: {
      type: String,
      required: false,
      trim: true,
    },
    fddTdd: {
      type: String,
      required: false,
      trim: true,
    },
    mcc: {
      type: String,
      required: false,
      trim: true,
    },
    mnc: {
      type: String,
      required: false,
      trim: true,
    },
    cellId: {
      type: String,
      required: false,
      trim: true,
    },
    pcId: {
      type: String,
      required: false,
      trim: true,
    },
    earfcn: {
      type: String,
      required: false,
      trim: true,
    },
    fbi: {
      type: String,
      required: false,
      trim: true,
    },
    ulbw: {
      type: String,
      required: false,
      trim: true,
    },
    dlbw: {
      type: String,
      required: false,
      trim: true,
    },
    tac: {
      type: String,
      required: false,
      trim: true,
    },
    rsrp: {
      type: String,
      required: false,
      trim: true,
    },
    rscp: {
      type: String,
      required: false,
      trim: true,
    },
    rsrq: {
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
    cqi: {
      type: String,
      required: false,
      trim: true,
    },
    txPower: {
      type: String,
      required: false,
      trim: true,
    },
    srxlev: {
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

const Servingcell = mongoose.model(
  "servingcell",
  servingcellSchema,
  "servingcell"
);

module.exports = Servingcell;
