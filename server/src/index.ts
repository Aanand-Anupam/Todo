import express from "express";
import "dotenv/config";
import { Port, DB_NAME, DB_URI } from "./config/env.js";
import { dbConnection } from "./db/db.connection.js";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authenticate.js";
import { apiRoute } from "./routes/api.route.js";

const app = express();

//Middlewares:
app.use(express.json());
app.use(cookieParser());
app.use("/api", apiRoute);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await dbConnection(DB_URI, DB_NAME);

  app.listen(Port, () => {
    console.log("Server is live on Port ", Port);
  });
};

startServer();
