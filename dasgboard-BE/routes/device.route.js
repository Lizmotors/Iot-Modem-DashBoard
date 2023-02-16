const router = require("express").Router();
const {
  register,
  getAllBlockChainData,
  getDeviceById,
} = require("../controllers/device.controller");

router.post("/register", register);

router.post("/", getAllBlockChainData);

router.get("/:id", getDeviceById);

module.exports = router;
