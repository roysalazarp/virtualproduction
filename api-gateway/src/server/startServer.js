import bodyParser from "body-parser";
import axios from 'axios';
import cors from "cors";
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { verify } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "dotenv/config";

import resolvers from "src/graphql/resolvers";
import typeDefs from "src/graphql/typeDefs";


const REFRESH_TOKEN_SECRET_USER3DARTIST = process.env.REFRESH_TOKEN_SECRET_USER3DARTIST;
const ACCESS_TOKEN_SECRET_USER3DARTIST = process.env.ACCESS_TOKEN_SECRET_USER3DARTIST;
const REFRESH_TOKEN_SECRET_USERFILMMAKER = process.env.REFRESH_TOKEN_SECRET_USERFILMMAKER;
const ACCESS_TOKEN_SECRET_USERFILMMAKER = process.env.ACCESS_TOKEN_SECRET_USERFILMMAKER;


const USERS_FILMMAKER_SERVICE_URI = process.env.USERS_FILMMAKER_SERVICE_URI;
const USERS_3DARTIST_SERVICE_URI = process.env.USERS_3DARTIST_SERVICE_URI;


const app = express();


const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

app.use(bodyParser.json());


app.use(cookieParser());

app.use(async (req, res, next) => {
  const refreshTokenFilmmaker = req.cookies["refresh-token-Filmmaker"];
  const accessTokenFilmmaker = req.cookies["access-token-Filmmaker"];
  if (!refreshTokenFilmmaker && !accessTokenFilmmaker) {
    return next();
  }
  if (accessTokenFilmmaker===undefined && refreshTokenFilmmaker) {
    let dataFilmmaker;
    try {
      dataFilmmaker = verify(refreshTokenFilmmaker, REFRESH_TOKEN_SECRET_USERFILMMAKER);
    } catch {
      return next();
    }
    const userFilmmaker = await axios({
      method: 'get',
      url: USERS_FILMMAKER_SERVICE_URI,
      params: {
        REFRESH_TOKEN: true,
        id: dataFilmmaker.userIdFilmmaker,
        count: dataFilmmaker.count
      }
    }).then(result => {
      return result.data
    })
    res.cookie("refresh-token-Filmmaker", userFilmmaker.refreshTokenFilmmaker);
    res.cookie("access-token-Filmmaker", userFilmmaker.accessTokenFilmmaker);
    req.userIdFilmmaker = userFilmmaker.id;
    return next();
  }
  try {
    const dataFilmmaker = verify(accessTokenFilmmaker, ACCESS_TOKEN_SECRET_USERFILMMAKER);
    req.userIdFilmmaker = dataFilmmaker.userIdFilmmaker;
    return next();
  } catch (err) {
    console.log(err)
  }
  if (!refreshTokenFilmmaker) {
    return next();
  }
  next();
});

app.use(async (req, res, next) => {
  const refreshToken3Dartist = req.cookies["refresh-token-3Dartist"];
  const accessToken3Dartist = req.cookies["access-token-3Dartist"];
  if (!refreshToken3Dartist && !accessToken3Dartist) {
    return next();
  }
  if (accessToken3Dartist===undefined && refreshToken3Dartist) {
    let data3Dartist;
    try {
      data3Dartist = verify(refreshToken3Dartist, REFRESH_TOKEN_SECRET_USER3DARTIST);
    } catch {
      return next();
    }
    const user3Dartist = await axios({
      method: 'get',
      url: USERS_3DARTIST_SERVICE_URI,
      params: {
        REFRESH_TOKEN: true,
        id: data3Dartist.userId3Dartist,
        count: data3Dartist.count
      }
    }).then(result => {
      return result.data
    })
    console.log(user3Dartist);
    res.cookie("refresh-token-3Dartist", user3Dartist.refreshToken3Dartist);
    res.cookie("access-token-3Dartist", user3Dartist.accessToken3Dartist);
    req.userId3Dartist = user3Dartist.id;
    return next();
  }
  try {
    const data3Dartist = verify(accessToken3Dartist, ACCESS_TOKEN_SECRET_USER3DARTIST);
    req.userId3Dartist = data3Dartist.userId3Dartist;
    return next();
  } catch (err) {
    console.log(err)
  }
  if (!refreshToken3Dartist) {
    return next();
  }
  next();
});

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true
  })
);

server.applyMiddleware({ app, cors: false, path: "/graphql" });

app.listen({ port: 7000 }, () =>
  console.log(`🚀 api gateway server ready`)
);