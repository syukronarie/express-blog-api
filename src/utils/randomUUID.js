const { v4 } = require("uuid");

const generateRandomUUID = () => v4();
module.exports = generateRandomUUID;
