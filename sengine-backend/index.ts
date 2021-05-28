import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import utilRoutes from "./routes/utils";
import initLogger from "./config/logger";
import db from "./config/database";
import userRoutes from "./routes/users";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());

const logger = initLogger("index");

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/utils", utilRoutes);

app.listen(port, async () => {
  logger.info(`Ready on port ${port}`);
  try {
    await db.authenticate();
    logger.info("Successfully Connected to Postgres");
  } catch (err) {
    logger.error(`Cannot connect to Postgres: ${err}`);
  }
});

const handle = (signal) => {
  logger.error(`Node Process Received event: ${signal}`);
};
process.on("SIGHUP", handle);
