const router = require("express").Router();
const {
  register,
  verifyOTP,
  sendOTP,
  updateUser,
  getAllUsers,
  getUserById,
  updateUserStatus,
  blockUser,
  login,
  sendOTPReset,
  verifyOTPReset,
} = require("../controllers/user.controller");

router.post("/register", register);

router.post("/login", login);

router.post("/otp/send", sendOTP);

router.post("/otp/verify", verifyOTP);

router.post("/reset/otp/send", sendOTPReset);

router.post("/reset/otp/verify", verifyOTPReset);

router.put("/profile", updateUser);

router.get("/all-users", getAllUsers);

router.get("/getUserById/:userId", getUserById);

router.post("/update-status", updateUserStatus);

router.post("/block", blockUser);

module.exports = router;
