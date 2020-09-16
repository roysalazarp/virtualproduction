import "dotenv/config";
import { sign } from "jsonwebtoken";

const REFRESH_TOKEN_SECRET_USERFILMMAKER = process.env.REFRESH_TOKEN_SECRET_USERFILMMAKER;
const ACCESS_TOKEN_SECRET_USERFILMMAKER = process.env.ACCESS_TOKEN_SECRET_USERFILMMAKER;

export const createTokens = (user) => {
  const refreshTokenFilmmaker = sign(
    { userIdFilmmaker: user.id, email: user.email, count: user.count },
    REFRESH_TOKEN_SECRET_USERFILMMAKER,
    {
      expiresIn: "7d"
    }
  );
  const accessTokenFilmmaker = sign({ userIdFilmmaker: user.id, email: user.email, }, ACCESS_TOKEN_SECRET_USERFILMMAKER, {
    expiresIn: "60min"
  });

  return { refreshTokenFilmmaker, accessTokenFilmmaker };
};