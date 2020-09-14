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


const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const USERS_SERVICE_URI = process.env.USERS_SERVICE_URI;


const app = express();


const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

app.use(bodyParser.json());


app.use(cookieParser());

app.use(async (req, res, next) => {
  const refreshToken = req.cookies["refresh-token"];
  const accessToken = req.cookies["access-token"];
  if (!refreshToken && !accessToken) {
    return next();
  }
  try {
    const data = verify(accessToken, ACCESS_TOKEN_SECRET);
    req.userId = data.userId;
    return next();
  } catch {}

  if (!refreshToken) {
    return next();
  }
  let data;

  try {
    data = verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    return next();
  }

  const user = await axios({
    method: 'get',
    url: USERS_SERVICE_URI,
    params: {
      REFRESH_TOKEN: true,
      id: data.userId,
      count: data.count
    }
  }).then(result => {
    return result.data
  })

  res.cookie("refresh-token", user.refreshToken);
  res.cookie("access-token", user.accessToken);
  req.userId = user.id;

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