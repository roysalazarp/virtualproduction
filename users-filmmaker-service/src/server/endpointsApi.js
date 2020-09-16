import "dotenv/config";
import { createTokens } from "./auth";
const bcrypt = require('bcryptjs');
const UserFilmmaker = require('../models/userFilmmaker');

const endpointsApi = app => {
  
  app.get('/', async (req, res, next) => {
    let request = await req.query.CASE
    switch (request) {
      case 'login':
          const email_login = await req.query.email;
          const password_login = await req.query.password;
          if (email_login || password_login) {
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
          break;
      case 'me':
          const userId_me = await req.query.id;
          const obtainedUserFilmmaker = await UserFilmmaker.findById({_id: userId_me});
          res.send({ ...obtainedUserFilmmaker._doc, password: null });
          break;
      case 'invalidate tokens':
          const userId_invalidateTokens = await req.query.id;
          const user_invalidateTokens = await UserFilmmaker.findById({_id: userId_invalidateTokens});
          if (!user_invalidateTokens) {
            return false;
          }
          user_invalidateTokens.count += 1;
          await user_invalidateTokens.save();
          res.send(true);
          break;
      case 'refresh token': 
          const userId_refreshToken = await req.query.id;
          const count = await req.query.count;
          const user_refreshToken = await UserFilmmaker.findById({_id: userId_refreshToken});
          if (!user_refreshToken || user_refreshToken.count !== parseInt(count)) {
            return next();
          }
          const tokensFilmmaker = createTokens(user_refreshToken);
          res.send(tokensFilmmaker);
          break;

      case 'fetch all users': 
          const obtainedUserFilmmaker_fetchAllUsers = await UserFilmmaker.find();
          res.send(obtainedUserFilmmaker_fetchAllUsers.map(user => {
            return {
              ...user._doc,
              password: null
            }
          }))
          break;   
      case 'fetch user by id': 
          const userId_fetchUserFilmmakerById = await req.query.id;
          const obtainedUserFilmmaker_fetchUserById = await UserFilmmaker.findById(userId_fetchUserFilmmakerById);
          obtainedUserFilmmaker_fetchUserById.password = null
          res.send(obtainedUserFilmmaker_fetchUserById);
          break;

      default:
          break;
    }
  });
  
  app.post('/', async (req, res, next) => {
    let request = await req.body.CASE
    switch (request) {
      case 'create user':
          const email_createUserFilmmaker = await req.body.email;
          const password_createUserFilmmaker = await req.body.passwordHashed;
          const existingUserFilmmaker = await UserFilmmaker.findOne({email: email_createUserFilmmaker});
          if (existingUserFilmmaker) {
            return next(new Error("UserFilmmaker already exists!"))
          }
          try {
            const user_createUser = await new UserFilmmaker({
              email: email_createUserFilmmaker,
              password: password_createUserFilmmaker
            });
            const result = await user_createUser.save()
            res.send({ ...result._doc, password: null });
          } catch (error) {
            throw error;
          }
          break;

      default:
          break;
    }
  });

  app.put('/', async (req, res, next) => {
    let request = await req.body.CASE
    switch (request) {
      case 'update booked scenes':
          const userId_updateBookedScenes = await req.body.id;
          const scenesArray = await req.body.idArray;
          const user = await UserFilmmaker.findById({_id: userId_updateBookedScenes});
          user.bookedScenes = scenesArray
          user.save()
          res.send({ ...user._doc, password: null });
          break;

      default:
          break;
    }
  });
};

export default endpointsApi;
