const bcrypt = require('bcryptjs');
const moment = require('moment');
const User = require('../models/adminUsers.model');
const sendMail = require('../utils/sendMail');

exports.createUser = async (firstName, lastName, email, password) => {
    if (await User.isEmailTaken(email)) {
        throw new Error('email_already_taken');
    }

    const hash = await bcrypt.hash(password, 10);

    const [user] = await Promise.all([
        User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
        }),
        await sendMail({
            toAddress: email,
            subject: '<Team> - Account Added',
            body: `Dear User, 
            <br /> 
            You have been added to the admin panel. 
            <br /> 
            Email: <strong style="color: blue;">${email}</strong>
            <br /> 
            Password: <strong style="color: blue;">${password}</strong>
            <br /> 
            Regards, <Team> Team.`,
        }),
    ]);

    return user;
};

exports.sendEmailApk = async (email) => {
    const attachments = ['https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg'];
    const finalAttachments = attachments.map((attStr) => {
        const t = attStr.split('/');
        const name = t[t.length - 1];
        return {
            filename: name,
            path: attStr,
        };
    });

    const promises = email.map((toAddr) =>
        sendMail({
            toAddress: toAddr,
            subject: '<Team> - App Access',
            body: `Dear User, 
            <br /> 
            You have been added to the app. 
            <br /> 
            Email: <strong style="color: blue;">${toAddr}</strong>
            <br /> 
            Password: <strong style="color: blue;">12345678</strong>
            <br /> 
            Regards, <Team> Team.`,
            attachments: finalAttachments,
        })
    );

    const result = await Promise.all(promises);

    return true;
};

exports.sendEmailCustom = async ({ email, subject, body, attachments }) => {
    const finalAttachments = attachments.map((attStr) => {
        const t = attStr.split('/');
        const name = t[t.length - 1];
        return {
            filename: name,
            path: attStr,
        };
    });

    const promises = email.map((toAddr) =>
        sendMail({
            toAddress: toAddr,
            subject: subject,
            body: body,
            attachments: finalAttachments,
        })
    );

    const result = await Promise.all(promises);

    return true;
};

exports.validateUser = async (email, password) => {
    const user = await User.findOne({ email: email }).lean().exec();
    const result = await bcrypt.compare(password, user.password);
    return { isPasswordMatch: result, user };
};

exports.getUserByEmail = async (email) => {
    const user = await User.findOne({ email: email }).lean().exec();
    return user;
};

exports.getUserById = async (userId, projection = {}) => {
    console.log('ser', userId);
    const user = await User.findOne({ _id: userId }, projection).lean().exec();
    return user;
};

exports.getAllUsers = async (from, size) => {
    const [result, totalCount] = await Promise.all([
        User.find().skip(from).limit(size).lean().exec(),
        User.count().lean().exec(),
    ]);
    return { result, totalCount };
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
