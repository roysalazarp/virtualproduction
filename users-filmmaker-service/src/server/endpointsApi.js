import "dotenv/config";
import { createTokens } from "./auth";
const bcrypt = require('bcryptjs');
const UserFilmmaker = require('../models/userFilmmaker');

const endpointsApi = app => {
  
  app.get('/', async (req, res, next) => {
    // FETCH_USER_BY_ID
    const FETCH_USER_BY_ID = await req.query.FETCH_USER_BY_ID;
    const userId_fetchUserFilmmakerById = await req.query.id;
    if (FETCH_USER_BY_ID && userId_fetchUserFilmmakerById) {
      const obtainedUserFilmmaker = await UserFilmmaker.findById(userId_fetchUserFilmmakerById);
      obtainedUserFilmmaker.password = null
      return res.send(obtainedUserFilmmaker);
    }
    //_________________________________________________//



    // FETCH_ALL_USERS
    const FETCH_ALL_USERS = await req.query.FETCH_ALL_USERS;
    if (FETCH_ALL_USERS) {
      const obtainedUserFilmmaker = await UserFilmmaker.find();
      return res.send(obtainedUserFilmmaker.map(user => {
        return {
          ...user._doc,
          password: null
        }
      }))
    }
    //_________________________________________________//



    // REFRESH_TOKEN
    const userId_refreshToken = await req.query.id;
    const count = await req.query.count;
    const REFRESH_TOKEN = await req.query.REFRESH_TOKEN;
    if (REFRESH_TOKEN && userId_refreshToken) {
      const user = await UserFilmmaker.findById({_id: userId_refreshToken});
      if (!user || user.count !== parseInt(count)) {
        return next();
      }
      const tokensFilmmaker = createTokens(user);
      return res.send(tokensFilmmaker);
    }
    //_________________________________________________//
    


    // INVALIDATE_TOKENS
    const userId_invalidateTokens = await req.query.id;
    const INVALIDATE_TOKENS = await req.query.INVALIDATE_TOKENS;
    if (INVALIDATE_TOKENS && userId_invalidateTokens) {
      const user = await UserFilmmaker.findById({_id: userId_invalidateTokens});
      if (!user) {
        return false;
      }
      user.count += 1;
      await user.save();
      return res.send(true);
    }
    //_________________________________________________//



    // ME
    const userId_me = await req.query.id;
    const ME = await req.query.ME;
    if (ME && userId_me) {
      const obtainedUserFilmmaker = await UserFilmmaker.findById({_id: userId_me});
      return res.send({ ...obtainedUserFilmmaker._doc, password: null });
    }
    //_________________________________________________//



    // LOGIN
    const LOGIN = await req.query.LOGIN;
    const email_login = await req.query.email;
    const password_login = await req.query.password;

    if (LOGIN && (email_login || password_login)) {
      const user = await UserFilmmaker.findOne({ email: email_login});
      if (!user) {
        return next(new Error('UserFilmmaker does not exist!'))
      }
      const comparePassword = await bcrypt.compare(password_login, user.password);
      if (!comparePassword ) {
        throw new Error('Incorrect password!')
      }
      const { accessTokenFilmmaker, refreshTokenFilmmaker } = createTokens(user);

      return res.send({ userIdFilmmaker: user.id, accessTokenFilmmaker: accessTokenFilmmaker, refreshTokenFilmmaker: refreshTokenFilmmaker, tokenExpirationFilmmaker: 1 });
    }
    //_________________________________________________//
  });
  
  app.post('/', async (req, res, next) => {
    // CREATE_USER
    const CREATE_USER = await req.body.CREATE_USER;
    const email_createUserFilmmaker = await req.body.email;
    const password_createUserFilmmaker = await req.body.passwordHashed;

    if (CREATE_USER && email_createUserFilmmaker && password_createUserFilmmaker) {
      const existingUserFilmmaker = await UserFilmmaker.findOne({email: email_createUserFilmmaker});
      if (existingUserFilmmaker) {
        return next(new Error("UserFilmmaker already exists!"))
      }
      
      try {
        const user = await new UserFilmmaker({
          email: email_createUserFilmmaker,
          password: password_createUserFilmmaker
        });
        const result = await user.save()
        return res.send({ ...result._doc, password: null });
      } catch (error) {
        throw error;
      }
    }
    //_________________________________________________//
  });

  app.put('/', async (req, res, next) => {
    // UPDATE_BOOKED_SCENES
    const userId_updateBookedScenes = await req.body.id;
    const scenesArray = await req.body.idArray;
    const UPDATE_BOOKED_SCENES = await req.body.UPDATE_BOOKED_SCENES;

    if (UPDATE_BOOKED_SCENES && userId_updateBookedScenes && scenesArray) {
      const user = await UserFilmmaker.findById({_id: userId_updateBookedScenes});
      user.bookedScenes = scenesArray
      user.save()
      return res.send({ ...user._doc, password: null });
    }
    //_________________________________________________//
  });
};

export default endpointsApi;
