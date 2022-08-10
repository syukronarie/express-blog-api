const { default: knex } = require("knex");
const knexfile = require("../knexfile");
const config = require("./config");

const db = knex(knexfile[config.env]);

module.exports = db;
