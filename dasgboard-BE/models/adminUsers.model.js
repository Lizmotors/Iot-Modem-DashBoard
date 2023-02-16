const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = mongoose.Schema(
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
        profilePicture: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
        },
    },
    {
        timestamps: true,
    }
);

// To Check if email is taken
adminUserSchema.statics.isEmailTaken = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
};

const AdminUser = mongoose.model('admin-users', adminUserSchema);

module.exports = AdminUser;
