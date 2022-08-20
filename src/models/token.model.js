const { tokenTypes } = require("../config/tokens");

class Token {
  constructor() {
    this.token = "";
    this.user = "";
    this.type = Object.freeze(tokenTypes);
    this.expires = new Date();
  }
}

module.exports = Token;
