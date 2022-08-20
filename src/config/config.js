const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("production", "development", "test").required(),
    PORT: Joi.number().default(8080),
    PG_HOST: Joi.string().required().description("Postgress Host"),
    PG_DATABASE: Joi.string().required().description("Postgress Database"),
    PG_USER: Joi.string().required().description("Postgress Username"),
    PG_PASSWORD: Joi.string().required().description("Postgress Password"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_SECRET_AUTH: Joi.string().required().description("JWT secret auth key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    PUBLIC_KEY: Joi.string().required().description("Public key generate by openssl"),
    PRIVATE_KEY: Joi.string().required().description("Private key generate by openssl"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  pg: {
    host: envVars.PG_HOST,
    database: envVars.PG_DATABASE,
    user: envVars.PG_USER,
    password: envVars.PG_PASSWORD,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    secretAuth: envVars.JWT_SECRET_AUTH,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  publicKey: envVars.PUBLIC_KEY,
  privateKey: envVars.PRIVATE_KEY,
};
