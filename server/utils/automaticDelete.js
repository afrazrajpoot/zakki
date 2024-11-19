const cron = require('node-cron');
const BookingModel = require('../models/bookingModel');

// Run every day at midnight (00:00)
const CLEANUP_INTERVAL = '0 0 * * *';

async function cleanupExpiredBookings() {
  try {
    // Get the current date and time in Pakistan timezone
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
    const pktDate = new Date(now); // pktDate is the current date in Pakistan time
    // Find bookings where endDate is less than the current date and time
    const expiredBookings = await BookingModel.find({
      endDate: { $lt: pktDate } // Find expired bookings
    });

    // Check if there are any expired bookings before attempting to delete
    if (expiredBookings.length > 0) {
      // Delete expired bookings
      const result = await BookingModel.deleteMany({
        endDate: { $lt: pktDate }
      });
    } else {
      console.log('No expired bookings found.');
    }

  } catch (error) {
    console.error('Error during booking cleanup:', error);
  }
}

function startBookingCleanupJob() {
  cron.schedule(CLEANUP_INTERVAL, () => {
    cleanupExpiredBookings();
  }, {
    scheduled: true,
    timezone: 'Asia/Karachi'  // Set to Pakistan timezone
  });

  console.log('Booking cleanup job scheduled');
}

module.exports = startBookingCleanupJob;
