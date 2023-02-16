const router = require('express').Router();
const {
    register,
    login,
    logout,
    authCheck,
    updateUser,
    getAllUsers,
    getUserById,
    sendEmailApk,
    sendEmailCustom,
} = require('../controllers/adminUser.controller');

router.post('/register', register);

router.post('/login', login);

router.get('/auth-check', authCheck);

router.get('/logout', logout);

router.put('/profile', updateUser);

router.post('/email-apk', sendEmailApk);

router.post('/email-custom', sendEmailCustom);

router.get('/all-users', getAllUsers);

router.get('/getUserById/:userId', getUserById);

module.exports = router;
