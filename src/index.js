const app = require("./app");
const config = require("./config/config");
const db = require("./config/db");
const logger = require("./config/logger");

let server;
db.raw("SELECT 1")
  .then(() => {
    logger.info("PostgreSQL connected");
    server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port} in ${config.env} mode
    `);
    });
  })
  .catch((e) => {
    logger.info("PostgreSQL not connected");
    logger.error(e);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
