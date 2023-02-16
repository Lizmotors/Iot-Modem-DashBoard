const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    rewards: {
      type: Number,
      required: true,
    },
    invites: {
      type: Number,
      required: true,
    },
    country: { type: String, required: true, trim: true },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    referralCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    plan: {
      type: String,
      required: true,
    },
    verification: {
      email: {
        isVerified: {
          type: Boolean,
          default: false,
        },
        otp: {
          isOtpSent: {
            type: Boolean,
            default: false,
          },
          value: Number,
          sentAt: Date,
          ExpiresAt: Date,
        },
      },
    },
    verificationReset: {
      email: {
        otp: {
          isOtpSent: {
            type: Boolean,
            default: false,
          },
          value: Number,
          sentAt: Date,
          ExpiresAt: Date,
        },
      },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// To Check if email is taken
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
