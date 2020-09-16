import "dotenv/config";
import { createTokens } from "./auth";
const bcrypt = require('bcryptjs');
const User3dartist = require('../models/user3dartist');

const endpointsApi = app => {
  
  app.get('/', async (req, res, next) => {
    // FETCH_USER_BY_ID
    const FETCH_USER_BY_ID = await req.query.FETCH_USER_BY_ID;
    const userId_fetchUser3dartistById = await req.query.id;
    if (FETCH_USER_BY_ID && userId_fetchUser3dartistById) {
      const obtainedUser3dartist = await User3dartist.findById(userId_fetchUser3dartistById);
      obtainedUser3dartist.password = null
      return res.send(obtainedUser3dartist);
    }
    //_________________________________________________//



    // FETCH_ALL_USERS
    const FETCH_ALL_USERS = await req.query.FETCH_ALL_USERS;
    if (FETCH_ALL_USERS) {
      const obtainedUser3dartist = await User3dartist.find();
      return res.send(obtainedUser3dartist.map(user => {
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
      const user = await User3dartist.findById({_id: userId_refreshToken});
      if (!user || user.count !== parseInt(count)) {
        return next();
      }
      const tokens = createTokens(user);
      return res.send(tokens);
    }
    //_________________________________________________//
    


    // INVALIDATE_TOKENS
    const userId_invalidateTokens = await req.query.id;
    const INVALIDATE_TOKENS = await req.query.INVALIDATE_TOKENS;
    if (INVALIDATE_TOKENS && userId_invalidateTokens) {
      const user = await User3dartist.findById({_id: userId_invalidateTokens});
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
      const obtainedUser3dartist = await User3dartist.findById({_id: userId_me});
      return res.send({ ...obtainedUser3dartist._doc, password: null });
    }
    //_________________________________________________//



    // LOGIN
    const LOGIN = await req.query.LOGIN;
    const email_login = await req.query.email;
    const password_login = await req.query.password;

    if (LOGIN && (email_login || password_login)) {
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
    //_________________________________________________//
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
