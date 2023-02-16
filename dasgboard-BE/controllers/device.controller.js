const {
  createBlockChain,
  getBlockChainById,
  getAllDevice,
} = require("../services/device.service");
var axios = require("axios");

exports.register = async (req, res) => {
  axios
    .post(
      `http://ec2-3-108-64-99.ap-south-1.compute.amazonaws.com:4000/api/mint?to=${req.body.toAccount}&amount=${req.body.amount}`,
      {
        to: req.body.toAccount,
        amount: req.body.amount,
      }
    )
    .then((respose) => {
      console.log("res", respose.data);

      const splitArr = respose.data.url.split("/");

      const formatData = {
        ...req.body,
        transactionLink: respose.data.url,
        transactionId: splitArr[splitArr.length - 1],
      };

      createBlockChain(formatData)
        .then(() => {
          res.send({ isSuccess: true });
        })
        .catch((err) => {
          console.log("err in catch", err);
          console.log("err in catch .response.data", err.response.data);
          res.status(500).json({
            errMsg: "Internal Server errror",
            isRegisterSuccess: false,
          });
        });
    })
    .catch((err) => {
      console.log("err out catch", err);
      console.log("err out catch response.data", err.response.data);
      res.status(400).json({
        errMsg: err,
        isRegisterSuccess: false,
      });
    });
};

exports.getAllBlockChainData = async (req, res) => {
  try {
    const { from = 0, size = 10 } = req.query;

    const result = await getAllBlockChain(parseInt(from), parseInt(size));
    res.send(result);
  } catch (error) {
    console.error(error);
    const { message } = error;
    switch (message) {
      case "INVALID_AT": {
        res.status(400).json({
          errMsg: "Invalid accessToken",
          error_code: 40013,
        });
        break;
      }
      default:
        res.status(500).json({
          errMsg: "Internal server error",
          error_code: 50000,
        });
        break;
    }
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getAllDevice(id);
    res.send(result);
  } catch (error) {
    console.error(error);
    const { message } = error;
    switch (message) {
      case "INVALID_AT": {
        res.status(400).json({
          errMsg: "Invalid accessToken",
          error_code: 40013,
        });
        break;
      }
      default:
        res.status(500).json({
          errMsg: "Internal server error",
          error_code: 50000,
        });
        break;
    }
  }
};
