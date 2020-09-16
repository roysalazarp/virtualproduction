import "dotenv/config";
import { sign } from "jsonwebtoken";

const REFRESH_TOKEN_SECRET_USER3DARTIST = process.env.REFRESH_TOKEN_SECRET_USER3DARTIST;
const ACCESS_TOKEN_SECRET_USER3DARTIST = process.env.ACCESS_TOKEN_SECRET_USER3DARTIST;

export const createTokens = (user) => {
  const refreshToken3Dartist = sign(
    { userId3Dartist: user.id, email: user.email, count: user.count },
    REFRESH_TOKEN_SECRET_USER3DARTIST,
    {
      expiresIn: "7d"
    }
  );
  const accessToken3Dartist = sign({ userId3Dartist: user.id, email: user.email, }, ACCESS_TOKEN_SECRET_USER3DARTIST, {
    expiresIn: "60min"
  });

  return { refreshToken3Dartist, accessToken3Dartist };
};