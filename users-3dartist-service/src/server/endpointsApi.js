import "dotenv/config";
import { createTokens } from "./auth";
const bcrypt = require('bcryptjs');
const User3dartist = require('../models/user3dartist');

const endpointsApi = app => {
  app.get('/', async (req, res, next) => {
    let request = await req.query.CASE
    switch (request) {
      case 'login':
          const email_login = await req.query.email;
          const password_login = await req.query.password;
          if (email_login || password_login) {
            const user = await User3dartist.findOne({ email: email_login});
            if (!user) {
              return next(new Error('User3dartist does not exist!'))
            }
            const comparePassword = await bcrypt.compare(password_login, user.password);
            if (!comparePassword ) {
              throw new Error('Incorrect password!')
            }
            const { accessToken3Dartist, refreshToken3Dartist } = createTokens(user);

            return res.send({ userId3Dartist: user.id, accessToken3Dartist: accessToken3Dartist, refreshToken3Dartist: refreshToken3Dartist, tokenExpiration3Dartist: 1 });
          }
          break;
      case 'me':
          const userId_me = await req.query.id;
          const obtainedUser3dartist_me = await User3dartist.findById({_id: userId_me});
          res.send({ ...obtainedUser3dartist_me._doc, password: null });
          break;
      case 'invalidate tokens':
          const userId_invalidateTokens = await req.query.id;
          const user_invalidateTokens = await User3dartist.findById({_id: userId_invalidateTokens});
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
          const user_refreshToken = await User3dartist.findById({_id: userId_refreshToken});
          if (!user_refreshToken || user_refreshToken.count !== parseInt(count)) {
            return next();
          }
          const tokens = createTokens(user_refreshToken);
          res.send(tokens);
          break;
      case 'fetch all users':
          const obtainedUser3dartist_fetchAllUsers = await User3dartist.find();
          res.send(obtainedUser3dartist_fetchAllUsers.map(user => {
            return {
              ...user._doc,
              password: null
            }
          }))
          break;
      case 'fetch user by id':
          const userId_fetchUser3dartistById = await req.query.id;
          const obtainedUser3dartist = await User3dartist.findById(userId_fetchUser3dartistById);
          obtainedUser3dartist.password = null
          res.send(obtainedUser3dartist);
          break;    
  
      default:
          break;
    }
  });
  
  app.post('/', async (req, res, next) => {
    // CREATE_USER
    const CREATE_USER = await req.body.CREATE_USER;
    const email_createUser3dartist = await req.body.email;
    const password_createUser3dartist = await req.body.passwordHashed;

    if (CREATE_USER && email_createUser3dartist && password_createUser3dartist) {
      const existingUser3dartist = await User3dartist.findOne({email: email_createUser3dartist});
      if (existingUser3dartist) {
        return next(new Error("User3dartist already exists!"))
      }
      
      try {
        const user = await new User3dartist({
          email: email_createUser3dartist,
          password: password_createUser3dartist
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
    // UPDATE_CREATED_SCENES
    const userId_updateCreatedScenes = await req.body.id;
    const scenesArray = await req.body.idArray;
    const UPDATE_CREATED_SCENES = await req.body.UPDATE_CREATED_SCENES;
    if (UPDATE_CREATED_SCENES && userId_updateCreatedScenes && scenesArray) {
      const user = await User3dartist.findById({_id: userId_updateCreatedScenes});
      user.createdScenes = scenesArray
      user.save()
      return res.send({ ...user._doc, password: null });
    }
    //_________________________________________________//
  });
};

export default endpointsApi;
