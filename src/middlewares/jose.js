/* eslint-disable security/detect-non-literal-fs-filename */
const { JWE, JWK } = require("node-jose");
const { encode, decode } = require("./base64");
const config = require("../config/config");

const makeKey = (pem) => JWK.asKey(pem, "pem");

async function encrypt(raw) {
  try {
    const key = config.publicKey;
    const jwKeys = await Promise.all([makeKey(key)]);
    const buffer = Buffer.from(JSON.stringify(raw));
    const encrypted = await JWE.createEncrypt(jwKeys[0]).update(buffer).final();
    return encode(encrypted);
  } catch (err) {
    throw new Error(err);
  }
}
async function decrypt(encrypted) {
  try {
    const key = config.privateKey;
    const jwKeys = await Promise.all([makeKey(key)]);
    const decoded = decode(encrypted);
    const { payload } = await JWE.createDecrypt(jwKeys[0]).decrypt(decoded);
    return JSON.parse(payload);
  } catch (err) {
    throw new Error(err);
  }
}
module.exports = {
  encrypt,
  decrypt,
};
