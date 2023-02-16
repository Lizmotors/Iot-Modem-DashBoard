const bcrypt = require('bcryptjs');
const moment = require('moment');
const User = require('../models/user.model');
const sendMail = require('../utils/sendMail');
const shortid = require('shortid');

exports.createUser = async (firstName, lastName, country, email, phone, password) => {
    if (await User.isEmailTaken(email)) {
        throw new Error('email_already_taken');
    }

    const hash = await bcrypt.hash(password, 10);

    let referral_code = shortid.generate();

    console.log(referral_code);

    const otp = Math.floor(Math.random() * 1000000);
    const ExpiresAt = moment().add(15, 'm').toDate();
    const sentAt = moment().toDate();
    const [user] = await Promise.all([
        User.create({
            firstName: firstName,
            lastName: lastName,
            country: country,
            email: email,
            phone: phone,
            password: hash,
            referralCode: referral_code,
            rewards: 0,
            invites: 0,
            plan: 'member',
            'verification.email.otp.isOtpSent': true,
            'verification.email.otp.sentAt': sentAt,
            'verification.email.otp.value': otp,
            'verification.email.otp.ExpiresAt': ExpiresAt,
        }),
        await sendMail({
            toAddress: email,
            subject: '<Team> - Account Verification',
            body: `Dear User,
            <br />
            OTP for validating your e-mail address is <strong style="color: blue;">${otp}</strong>.
            <br />
            Valid for 15 minutes. Kindly don't share your otp with anyone.
            <br />
            Regards, <Team> Team.`,
        }),
    ]);

    return user;
};

exports.validateUser = async (email, password) => {
    const user = await User.findOne({ email: email }).lean().exec();
    console.log('user', user);
    if (user) {
        const result = await bcrypt.compare(password, user.password);
        return { isPasswordMatch: result, user };
    } else {
        return { isPasswordMatch: false };
    }
};

exports.getUserByEmail = async (email) => {
    const user = await User.findOne({ email: email }).lean().exec();
    return user;
};

exports.getUserById = async (userId, projection = {}) => {
    const user = await User.findOne({ _id: userId }, projection).lean().exec();
    return user;
};

exports.getAllUsers = async (from, size) => {
    const [result, totalCount] = await Promise.all([
        User.find().lean().exec(),
        User.count().lean().exec(),
    ]);
    return { result, totalCount };
};

exports.sendOTP = async (email, otp, sentAt, ExpiresAt) => {
    const userData = await this.getUserByEmail(email);
    if (!userData) {
        throw new Error('USER_NOT_REGISTERED');
    }
    const [user] = await Promise.all([
        User.findOneAndUpdate(
            { email },
            {
                $set: {
                    'verification.email.isVerified': false,
                    'verification.email.otp.isOtpSent': true,
                    'verification.email.otp.sentAt': sentAt,
                    'verification.email.otp.value': otp,
                    'verification.email.otp.ExpiresAt': ExpiresAt,
                },
            }
        )
            .lean()
            .exec(),
        await sendMail({
            toAddress: email,
            subject: '<Team> - Account Verification',
            body: `Dear User, 
            <br /> 
            OTP for validating your e-mail address is <strong style="color: blue;">${otp}</strong>. 
            <br /> 
            Valid for 15 minutes. Kindly don't share your otp with anyone.
            <br /> 
            Regards, <Team> Team.`,
        }),
    ]);
    return user;
};

exports.sendFortgetOTP = async (email, otp, sentAt, ExpiresAt) => {
    const userData = await this.getUserByEmail(email);
    if (!userData) {
        throw new Error('USER_NOT_REGISTERED');
    }
    const [user] = await Promise.all([
        User.findOneAndUpdate(
            { email },
            {
                $set: {
                    'verificationReset.email.otp.isOtpSent': true,
                    'verificationReset.email.otp.sentAt': sentAt,
                    'verificationReset.email.otp.value': otp,
                    'verificationReset.email.otp.ExpiresAt': ExpiresAt,
                },
            }
        )
            .lean()
            .exec(),
        await sendMail({
            toAddress: email,
            subject: '<Team> - Account Verification',
            body: `Dear User, 
            <br /> 
            OTP for validating your e-mail address is <strong style="color: blue;">${otp}</strong>. 
            <br /> 
            Valid for 15 minutes. Kindly don't share your otp with anyone.
            <br /> 
            Regards, <Team> Team.`,
        }),
    ]);

    return user;
};

exports.verifyOTP = async (email, otp) => {
    const user = await this.getUserByEmail(email);
    if (!user) {
        throw new Error('USER_NOT_REGISTERED');
    }
    const {
        verification: {
            email: { otp: { value: OtpFromDb, isOtpSent, sentAt, ExpiresAt } = {} } = {},
        } = {},
    } = user;
    if (!isOtpSent) {
        throw new Error('OTP_NOT_SENT');
    }
    if (otp !== OtpFromDb) {
        throw new Error('OTP_INCORRECT');
    }

    const isExpired = !moment().isBefore(moment(ExpiresAt));
    if (isExpired) {
        throw new Error('OTP_EXPIRED');
    }
    await User.updateOne(
        { email },
        {
            $set: {
                'verification.email.isVerified': true,
            },
            $unset: {
                'verification.email.otp.isOtpSent': '',
                'verification.email.otp.sentAt': '',
                'verification.email.otp.value': '',
                'verification.email.otp.ExpiresAt': '',
            },
        }
    )
        .lean()
        .exec();
    return { isOTPVerified: true, user };
};

exports.verifyForgetOTP = async (email, otp, password) => {
    const user = await this.getUserByEmail(email);
    if (!user) {
        throw new Error('USER_NOT_REGISTERED');
    }
    const {
        verificationReset: {
            email: { otp: { value: OtpFromDb, isOtpSent, sentAt, ExpiresAt } = {} } = {},
        } = {},
    } = user;
    if (!isOtpSent) {
        throw new Error('OTP_NOT_SENT');
    }
    if (otp !== OtpFromDb) {
        throw new Error('OTP_INCORRECT');
    }

    const isExpired = !moment().isBefore(moment(ExpiresAt));
    if (isExpired) {
        throw new Error('OTP_EXPIRED');
    }
    const hash = await bcrypt.hash(password, 10);
    await User.updateOne(
        { email },
        {
            $set: {
                'verification.email.isVerified': true,
                password: hash,
            },
            $unset: {
                'verificationReset.email.otp.isOtpSent': '',
                'verificationReset.email.otp.sentAt': '',
                'verificationReset.email.otp.value': '',
                'verificationReset.email.otp.ExpiresAt': '',
            },
        }
    )
        .lean()
        .exec();
    return { isOTPVerified: true, user };
};

exports.updateUser = async ({ userId, name, password, subUsers }) => {
    const hash = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
            name,
            password: hash,
            ...(subUsers ? { subUsers } : {}),
        },
        { returnDocument: 'after' }
    )
        .lean()
        .exec();
    return updatedUser;
};

exports.updateProfilePicture = async ({ email, profileAirlinePicture }) => {
    const user = await User.findOne({ email: email }).lean().exec();
    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            profileAirlinePicture: profileAirlinePicture,
        },
        { returnDocument: 'after' }
    )
        .lean()
        .exec();
    console.log('update', updatedUser);
    return updatedUser;
};

exports.updateStatus = async ({ userId, value }) => {
    const user = await User.findOne({ _id: userId }).lean().exec();
    console.log('service update', userId, value);
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
            verification: {
                ...user.verification,
                isAdminVerified: value,
            },
        },
        { returnDocument: 'after' }
    )
        .lean()
        .exec();
    return updatedUser;
};

exports.blockUser = async ({ userId, value }) => {
    const user = await User.findOne({ _id: userId }).lean().exec();
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
            verification: {
                ...user.verification,
                isBlocked: value,
            },
        },
        { returnDocument: 'after' }
    )
        .lean()
        .exec();
    return updatedUser;
};
