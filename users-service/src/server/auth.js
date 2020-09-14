import "dotenv/config";
import { sign } from "jsonwebtoken";
const User = require('../models/user');

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const createTokens = (user) => {
  const refreshToken = sign(
    { userId: user.id, email: user.email, count: user.count },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d"
    }
  );
  const accessToken = sign({ userId: user.id, email: user.email, }, ACCESS_TOKEN_SECRET, {
    expiresIn: "60min"
  });

  return { refreshToken, accessToken };
};