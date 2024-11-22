const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../midddelware/auth');

const router = express.Router();

router.post('/signup', [
    body('username').isString().notEmpty(),
    body('email').isString().notEmpty(),

    body('password').isString().isLength({ min: 6 })
], authController.signup);

router.post('/login', [
    body('email').isString().notEmpty(),
    body('password').isString().notEmpty()
], authController.login);
router.route('/update-user').put(auth,authController.updateUser)
router.route('/social-login').post(authController.socialLogin)

module.exports = router;