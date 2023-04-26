const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'p24'],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/api/v1/bookings/success?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${process.env.FRONTEND_URL}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'pln',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  await Booking.create({ tour, user, price });

  res.redirect('https://jacekpietrzak.pl');
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    data: bookings,
  });
});

exports.createBooking = handlerFactory.createOne(Booking);
exports.getOneBooking = handlerFactory.getOne(Booking);
exports.getAllBookings = handlerFactory.getAll(Booking);
exports.deleteOneBooking = handlerFactory.deleteOne(Booking);
