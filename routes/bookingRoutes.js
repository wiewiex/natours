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

router.get(
  '/my-bookings',
  authController.protect,
  authController.restrictTo('user'),
  bookingController.getMyBookings
);

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  bookingController.getAllBookings
);

router.get(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  bookingController.getOneBooking
);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  bookingController.deleteOneBooking
);

module.exports = router;
