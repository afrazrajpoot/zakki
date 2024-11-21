const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', [
    body('username').isString().notEmpty(),
    body('password').isString().isLength({ min: 6 })
], authController.signup);

router.post('/login', [
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty()
], authController.login);

module.exports = router;