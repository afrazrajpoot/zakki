const express = require('express');
const auth = require('../midddelware/auth');
const { addPayment, getPaymentData, searchData } = require('../controllers/paymentController');
const router = express.Router();

router.route('/add-payment').post(auth,addPayment)
router.route('/get-payment').get(auth,getPaymentData)
router.route('/search-data').post(auth,searchData)
module.exports = router
