import "dotenv/config";
const Booking = require('../models/booking');


const endpointsApi = app => {
  app.get('/', async (req, res, next) => {

    // FETCH_BOOKING_BY_ID
    const FETCH_BOOKING_BY_ID = await req.query.FETCH_BOOKING_BY_ID;
    const user_fetchBookingById = await req.query.id;
    if (FETCH_BOOKING_BY_ID && user_fetchBookingById) {
      const obtainedBooking = await Booking.findOne({ _id: user_fetchBookingById });
      return res.send(obtainedBooking);
    }
    //_________________________________________________//

    // FETCH_BOOKINGS_BY_IDS
    const FETCH_BOOKINGS_BY_IDS = await req.query.FETCH_BOOKINGS_BY_IDS;
    const user_fetchBookingsByIds = await req.query.ids;
    if (FETCH_BOOKINGS_BY_IDS && user_fetchBookingsByIds) {

      const obtainedBooking = user_fetchBookingsByIds.map(async result => {
        const bookings = await Booking.find({ _id: { $in: user_fetchBookingsByIds } });
        return bookings;
      });
      const results = await Promise.all(obtainedBooking)
      return res.send(results);
    }
    //_________________________________________________//


    // FETCH_BOOKING_BY_SCENE_ID
    const FETCH_BOOKING_BY_SCENE_ID = await req.query.FETCH_BOOKING_BY_SCENE_ID;
    const user_fetchBookingBySceneId = await req.query.id;
    if (FETCH_BOOKING_BY_SCENE_ID && user_fetchBookingBySceneId) {
      const obtainedBooking = await Booking.findOne({ scene: user_fetchBookingBySceneId });
      return res.send(obtainedBooking);
    }
    //_________________________________________________//



    // FETCH_BOOKINGS_BY_USER
    const FETCH_BOOKINGS_BY_USER = await req.query.FETCH_BOOKINGS_BY_USER;
    const user_fetchBookingsByUser = await req.query.user;
    
    if (FETCH_BOOKINGS_BY_USER && user_fetchBookingsByUser) {
      const obtainedBooking = await Booking.find({ user: user_fetchBookingsByUser });
      return res.send(obtainedBooking);
    }
    //_________________________________________________//



    // FETCH_ALL_BOOKINGS
    const FETCH_ALL_BOOKINGS = await req.query.FETCH_ALL_BOOKINGS;
    if (FETCH_ALL_BOOKINGS) {
      const obtainedBooking = await Booking.find();
      return res.send(obtainedBooking.map(bookings => {
        return bookings;
      }))
    }
    //_________________________________________________//
  });
  app.post('/', async (req, res, next) => {
    // CREATE_BOOKING
    const CREATE_BOOKING = await req.body.CREATE_BOOKING;
    const user_createBooking = await req.body.user;
    const scene_createBooking = await req.body.scene;
    if (CREATE_BOOKING && user_createBooking && scene_createBooking) {
      try {
        const booking = await new Booking({
          user: user_createBooking,
          scene: scene_createBooking,
        });
        const result = await booking.save();
        return res.send({...result._doc});
      } catch (error) {
        throw error;
      }
    }
    //_________________________________________________//  

  });
  app.delete('/', async (req, res, next) => {
    // CANCEL_BOOKING
    const CANCEL_BOOKING = await req.query.CANCEL_BOOKING;
    const user_cancelBooking = await req.query.user;
    const bookingId_cancelBooking = await req.query.bookingId;
    if (CANCEL_BOOKING && user_cancelBooking && bookingId_cancelBooking) {
      try {
        const booking = await Booking.deleteOne({_id: bookingId_cancelBooking});
        return res.send({...booking._doc});
      } catch (error) {
        throw error;
      }
    }
    //_________________________________________________//  

  });

};

export default endpointsApi;