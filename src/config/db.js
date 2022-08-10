const { default: knex } = require("knex");
const config = require("./config");
const knexfile = require("../knexfile");

const db = knex(knexfile[config.env]);

module.exports = db;
