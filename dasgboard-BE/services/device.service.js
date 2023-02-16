const bcrypt = require("bcryptjs");
const moment = require("moment");
const Device = require("../models/device.model");
const Gps = require("../models/gps.model");
const Neighbourcell = require("../models/neighbourcell.model");
const Network = require("../models/network.model");
const Servingcell = require("../models/servingcell.model");

exports.createBlockChain = async (data) => {
  const [user] = await Promise.all([
    Device.create({
      ...data,
    }),
  ]);

  return user;
};

exports.getBlockChainById = async (id) => {
  console.log("id", id);
  const user = await Device.findOne({ _id: id }).lean().exec();
  return user;
};

exports.getAllDevice = async (id) => {
  const [device, gps, neighbourcell, network, servingcell] = await Promise.all([
    Device.findOne({ _id: id }).lean().exec(),
    Gps.find({ deviceId: id }).lean().exec(),
    Neighbourcell.find({ deviceId: id }, {}).lean().exec(),
    Network.find({ deviceId: id }, {}).lean().exec(),
    Servingcell.find({ deviceId: id }, {}).lean().exec(),
  ]);
  return { device, gps, neighbourcell, network, servingcell };
  // console.log("id", id);
  // const user = await Device.find().lean().exec();
  // return { user };
};
