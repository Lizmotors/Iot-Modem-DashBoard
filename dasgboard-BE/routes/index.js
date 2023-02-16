const router = require("express").Router();

router.use("/users", require("./users.routes"));
router.use("/admin", require("./adminUsers.route"));
router.use("/device", require("./device.route"));

module.exports = router;
