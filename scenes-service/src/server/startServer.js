import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import UsersServiceDBconnection from "src/db/connection";

import endpointsApi from "src/server/endpointsApi";

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    preflightContinue: true,
    exposedHeaders: [
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept",
      "X-Password-Expired"
    ],
    optionsSuccessStatus: 200
  })
);

endpointsApi(app);

UsersServiceDBconnection.then(
  () => {
    app.listen(7102, () => {
      console.log('scenes service working')
    });
  }
);