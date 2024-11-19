const express = require("express");
const router = express.Router();
const { createBooking, checkinAvailibility, getBookingDetail, approveBooking, checkAvailibility, rejectBooking } = require("../controllers/bookingControler");
router.route("/booking").post(createBooking);
router.route("/availability").post(checkinAvailibility);
router.route('/bookingDetail').get(getBookingDetail)
router.route('/approve-booking').post(approveBooking)
router.route('/check-availibility').post(checkAvailibility)
router.route('/reject-booking').post(rejectBooking)
module.exports = router;
