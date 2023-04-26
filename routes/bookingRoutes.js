const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);
router.get('/success', bookingController.createBookingCheckout);

router.use(authController.protect);

router.get('/my-bookings', bookingController.getMyBookings);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
router
  .route('/:id')
  .get(bookingController.getOneBooking)
  .delete(bookingController.deleteOneBooking);

module.exports = router;
