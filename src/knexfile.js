const config = require("./config/config");

const { host, database, user, password } = config.pg;

const development = {
  client: "pg",
  connection: {
    host,
    database,
    user,
    password,
  },
};

const production = {
  client: "pg",
  connection: {
    host,
    database,
    user,
    password,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 2,
    max: 10,
  },
};

module.exports = {
  development,
  production,
};
