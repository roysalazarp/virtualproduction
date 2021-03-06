import "dotenv/config";
import { createTokens } from "./auth";
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


const endpointsApi = app => {
  
  app.get('/', async (req, res, next) => {
    // FETCH_USER_BY_ID
    const FETCH_USER_BY_ID = await req.query.FETCH_USER_BY_ID;
    const userId_fetchUserById = await req.query.id;
    if (FETCH_USER_BY_ID && userId_fetchUserById) {
      const obtainedUser = await User.findById(userId_fetchUserById);
      obtainedUser.password = null
      return res.send(obtainedUser);
    }
    //_________________________________________________//



    // FETCH_ALL_USERS
    const FETCH_ALL_USERS = await req.query.FETCH_ALL_USERS;
    if (FETCH_ALL_USERS) {
      const obtainedUser = await User.find();
      return res.send(obtainedUser.map(user => {
        return {
          ...user._doc,
          password: null
        }
      }))
    }
    //_________________________________________________//



    // REFRESH_TOKEN
    const userId_refreshToken = await req.query.id;
    const REFRESH_TOKEN = await req.query.REFRESH_TOKEN;
    const count = await req.query.count;
    if (REFRESH_TOKEN && userId_refreshToken) {
      const user = await User.findById({_id: userId_refreshToken});
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
      const user = await User.findById({_id: userId_invalidateTokens});
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
      const obtainedUser = await User.findById({_id: userId_me});
      return res.send({ ...obtainedUser._doc, password: null });
    }
    //_________________________________________________//



    // LOGIN
    const LOGIN = await req.query.LOGIN;
    const email_login = await req.query.email;
    const password_login = await req.query.password;

    if (LOGIN && (email_login || password_login)) {
      const user = await User.findOne({ email: email_login});
      if (!user) {
        return next(new Error('User does not exist!'))
      }
      const comparePassword = await bcrypt.compare(password_login, user.password);
      if (!comparePassword ) {
        throw new Error('Incorrect password!')
      }
      const { accessToken, refreshToken } = createTokens(user);

      return res.send({ userId: user.id, accessToken: accessToken, refreshToken: refreshToken, tokenExpiration: 1 });
    }
    //_________________________________________________//
  });
  
  app.post('/', async (req, res, next) => {
    // CREATE_USER
    const CREATE_USER = await req.body.CREATE_USER;
    const email_createUser = await req.body.email;
    const password_createUser = await req.body.passwordHashed;

    if (CREATE_USER && email_createUser && password_createUser) {
      const existingUser = await User.findOne({email: email_createUser});
      if (existingUser) {
        return next(new Error("User already exists!"))
      }
      
      try {
        const user = await new User({
          email: email_createUser,
          password: password_createUser
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
      const user = await User.findById({_id: userId_updateCreatedScenes});
      user.createdScenes = scenesArray
      user.save()
      return res.send({ ...user._doc, password: null });
    }
    //_________________________________________________//
  });
};

export default endpointsApi;
