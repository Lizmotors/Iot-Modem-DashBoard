const {
  createUser,
  getUserById,
  verifyOTP: verifyOTPService,
  sendOTP: sendOTPService,
  updateUser: updateUserService,
  getAllUsers,
  updateStatus,
  blockUser,
  validateUser,
  sendFortgetOTP,
  verifyForgetOTP,
} = require("../services/user.service");

const {
  getUserById: getAdminUserById,
} = require("../services/adminUsers.service");
const moment = require("moment");

exports.register = async (req, res) => {
  const { firstName, lastName, email, country, phone, password, referralCode } =
    req.body;

  if (
    !email ||
    !password ||
    !phone ||
    !lastName ||
    !firstName ||
    !country ||
    !referralCode
  ) {
    return res.status(400).json({
      errMsg: `Required fields are - email, phone, firstName, lastName, country, password, referralCode`,
      isRegisterSuccess: false,
    });
  }

  createUser(firstName, lastName, country, email, phone, password)
    .then(async (user) => {
      res.send({ isRegisterSuccess: true });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "email_already_taken") {
        res.status(400).json({
          errMsg: "Given Mail is already Taken by another user",
          isRegisterSuccess: false,
        });
      } else {
        res.status(500).json({
          errMsg: "Internal Server errror",
          isRegisterSuccess: false,
        });
      }
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log(password);
  if (!email || !password) {
    return res.status(400).json({
      errMsg: "Required fields - email, password",
      isLoginSuccess: false,
    });
  }

  validateUser(email, password)
    .then(
      ({
        isPasswordMatch,
        user: {
          _id: accessToken,
          password,
          verification: { email: { isVerified } = {}, isAdminVerified } = {},
          ...filteredUser
        } = {},
      } = {}) => {
        console.log("admin", isAdminVerified, isPasswordMatch);
        if (!isPasswordMatch) {
          throw new Error("login_failed");
        }
        if (!isVerified) {
          throw new Error("email_not_verified");
        }
        res.send({ isLoginSuccess: true, user: filteredUser, accessToken });
      }
    )
    .catch((err) => {
      console.error(err);
      if (err.message === "login_failed") {
        res.status(400).json({
          isLoginSuccess: false,
          errCode: 40001,
          errMsg: "Invalid email or password",
        });
      } else if (err.message === "email_not_verified") {
        res.status(400).json({
          isLoginSuccess: false,
          errCode: 40002,
          errMsg: "Email is not verified yet.",
        });
      } else if (err.message === "admin_not_verified") {
        res.status(400).json({
          isLoginSuccess: false,
          errCode: 40003,
          errMsg: "Your Account is in review",
        });
      } else {
        res.status(500).json({ errMsg: "Internal Server errror" });
      }
    });
};

exports.updateUser = async (req, res) => {
  try {
    const accessToken = req.header("accesstoken") || "";
    if (!accessToken) {
      return res.status(400).json({
        errMsg: "Missing accessToken header",
      });
    }
    const { name, profileAirlinePicture } = req.body;
    if (!subUsers && !password && !name) {
      return res.status(400).json({
        errMsg: "Either one of the fields - subUsers, password, name required",
        isUpdated: false,
      });
    }
    const user = await updateUserService({
      name,
      password,
      subUsers,
      userId: accessToken,
    });
    if (!user) {
      return res.status(400).json({
        errMsg: "Invalid accessToken",
        isUpdated: false,
      });
    }
    const {
      password: passFromDB,
      verification,
      _id,
      __v,
      ...filteredUserData
    } = user;
    res.send({
      isUpdated: true,
      user: filteredUserData,
    });
  } catch (error) {
    console.error(error);
    const { message } = error;
    res
      .status(500)
      .json({ errMsg: "Internal Server errror", isUpdated: false });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        errMsg: "Required fields - email, otp",
        isOTPVerified: false,
      });
    }
    const { isOTPVerified, user } = await verifyOTPService(
      email,
      parseInt(`${otp}`)
    );
    const {
      password,
      verification,
      _id: accessToken,
      ...filteredUserData
    } = user;
    res.send({
      isOTPVerified,
      user: filteredUserData,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    const { message } = error;
    switch (message) {
      case "USER_NOT_REGISTERED": {
        res.status(400).json({
          errMsg: "Given email is not registered with us",
          error_code: 40003,
          isOptVerified: false,
        });
        break;
      }

      case "OTP_INCORRECT": {
        res.status(400).json({
          errMsg: "Given OTP is incorrect for the email",
          error_code: 40005,
          isOptVerified: false,
        });
        break;
      }

      case "OTP_EXPIRED": {
        res.status(400).json({
          errMsg: "Given OTP is expired - OTPs are valid only for 15 mins",
          error_code: 40006,
          isOptVerified: false,
        });
        break;
      }
      default:
        res.status(500).json({
          errMsg: "Internal server error",
          error_code: 50000,
          isOptVerified: false,
        });
        break;
    }
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        errMsg: "Required fields - email",
        isOTPSent: false,
      });
    }

    const otp = Math.floor(Math.random() * 1000000);
    const ExpiresAt = moment().add(15, "m").toDate();
    const sentAt = moment().toDate();
    const isOTPSent = await sendOTPService(email, otp, sentAt, ExpiresAt);
    res.send({
      isOTPSent,
    });
  } catch (error) {
    console.error(error);
    const { message } = error;
    switch (message) {
      case "USER_NOT_REGISTERED": {
        res.status(400).json({
          errMsg: "Given email is not registered with us",
          error_code: 40003,
          isOptVerified: false,
        });
        break;
      }

      case "OTP_INCORRECT": {
        res.status(400).json({
          errMsg: "Given OTP is incorrect for the email",
          error_code: 40005,
          isOptVerified: false,
        });
        break;
      }

      case "OTP_EXPIRED": {
        res.status(400).json({
          errMsg: "Given OTP is expired - OTPs are valid only for 15 mins",
          error_code: 40006,
          isOptVerified: false,
        });
        break;
      }
      default:
        res.status(500).json({
          errMsg: "Internal server error",
          error_code: 50000,
          isOptVerified: false,
        });
        break;
    }
  }
};

exports.sendOTPReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        errMsg: "Required fields - email",
        isOTPSent: false,
      });
    }

    const otp = Math.floor(Math.random() * 1000000);
    const ExpiresAt = moment().add(15, "m").toDate();
    const sentAt = moment().toDate();
    const isOTPSent = await sendFortgetOTP(email, otp, sentAt, ExpiresAt);
    res.send({
      isOTPSent,
    });
  } catch (error) {
    console.error(error);
    const { message } = error;
    switch (message) {
      case "USER_NOT_REGISTERED": {
        res.status(400).json({
          errMsg: "Given email is not registered with us",
          error_code: 40003,
          isOptVerified: false,
        });
        break;
      }

      default:
        res.status(500).json({
          errMsg: "Internal server error",
          error_code: 50000,
          isOptVerified: false,
        });
        break;
    }
  }
};

exports.verifyOTPReset = async (req, res) => {
  try {
    const { email, otp, password: dataPassword } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        errMsg: "Required fields - email, otp",
        isOTPVerified: false,
      });
    }
    const { isOTPVerified, user } = await verifyForgetOTP(
      email,
      parseInt(`${otp}`),
      dataPassword
    );
    const {
      password,
      verification,
      _id: accessToken,
      ...filteredUserData
    } = user;
    res.send({
      isOTPVerified,
      user: filteredUserData,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    const { message } = error;
    switch (message) {
      case "USER_NOT_REGISTERED": {
        res.status(400).json({
          errMsg: "Given email is not registered with us",
          error_code: 40003,
          isOptVerified: false,
        });
        break;
      }

      case "OTP_INCORRECT": {
        res.status(400).json({
          errMsg: "Given OTP is incorrect for the email",
          error_code: 40005,
          isOptVerified: false,
        });
        break;
      }

      case "OTP_EXPIRED": {
        res.status(400).json({
          errMsg: "Given OTP is expired - OTPs are valid only for 15 mins",
          error_code: 40006,
          isOptVerified: false,
        });
        break;
      }
      default:
        res.status(500).json({
          errMsg: "Internal server error",
          error_code: 50000,
          isOptVerified: false,
        });
        break;
    }
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const accessToken = req.header("accesstoken") || "";
    const { from = 0, size = 10 } = req.query;
    if (!accessToken) {
      return res.status(400).json({
        errMsg: "Missing accessToken header",
      });
    }
    const userData = await getAdminUserById(accessToken);
    if (!userData) {
      throw new Error("INVALID_AT");
    }
    const result = await getAllUsers(parseInt(from), parseInt(size));
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

exports.getUserById = async (req, res) => {
  try {
    const accessToken = req.header("accesstoken") || "";
    if (!accessToken) {
      return res.status(400).json({
        errMsg: "Missing accessToken header",
      });
    }
    // const user = await getAdminUserById(accessToken);
    // if (!user) {
    //     return res.status(400).json({
    //         errorMsg: 'Invalid accessToken',
    //     });
    // }

    const { userId } = req.params;

    const userData = await getUserById(userId);
    if (!userData) {
      return res.status(400).json({
        errMsg: "Invalid Id",
      });
    }
    const { password, verification, _id, __v, ...filteredUserData } = userData;
    res.send({
      user: filteredUserData,
    });
  } catch (error) {
    console.error(error);
    const { message } = error;
    res
      .status(500)
      .json({ errMsg: "Internal Server errror", isAuthenticated: false });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const accessToken = req.header("accesstoken") || "";
    if (!accessToken) {
      return res.status(400).json({
        errMsg: "Missing accessToken header",
      });
    }
    const user = await getAdminUserById(accessToken);
    if (!user) {
      return res.status(400).json({
        errMsg: "Invalid accessToken",
      });
    }

    const { userId, value } = req.body;

    console.log(userId, value);

    const userData = await updateStatus({ userId, value });
    console.log(userData);
    if (!userData) {
      return res.status(400).json({
        errMsg: "Invalid Id",
      });
    }
    const { password, verification, _id, __v, ...filteredUserData } = userData;
    res.send({
      user: filteredUserData,
      isSuccess: true,
    });
  } catch (error) {
    console.error(error);
    const { message } = error;
    res
      .status(500)
      .json({ errMsg: "Internal Server errror", isAuthenticated: false });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const accessToken = req.header("accesstoken") || "";
    if (!accessToken) {
      return res.status(400).json({
        errMsg: "Missing accessToken header",
      });
    }
    const user = await getAdminUserById(accessToken);
    if (!user) {
      return res.status(400).json({
        errMsg: "Invalid accessToken",
      });
    }

    const { userId, value } = req.body;

    const userData = await blockUser({ userId, value });
    if (!userData) {
      return res.status(400).json({
        errMsg: "Invalid Id",
      });
    }
    const { password, verification, _id, __v, ...filteredUserData } = userData;
    res.send({
      user: filteredUserData,
      isSuccess: true,
    });
  } catch (error) {
    console.error(error);
    const { message } = error;
    res
      .status(500)
      .json({ errMsg: "Internal Server errror", isAuthenticated: false });
  }
};
