const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const CONFIG = require('../../config/config');

class JwtServices {

    constructor() {
        this.privateKeyPath = path.resolve(__dirname, '../secrets/privateKey.pem');
        this.publicKeyPath = path.resolve(__dirname, '../secrets/publicKey.pem');
    }

    createLoginToken = async (tokenData) => {
        const cert = fs.readFileSync(this.privateKeyPath, "utf8");
        const token = jwt.sign(tokenData, cert, {
            expiresIn: CONFIG.JWT_TOKEN.EXPIRY_TIME,
            algorithm: CONFIG.JWT_TOKEN.ALGORITHM
        })
        return token;

    }

    verifyLoginToken = async (tokenData) => {

        const cert = fs.readFileSync(this.publicKeyPath, "utf8");
        const decoded = jwt.verify(tokenData, cert, {
            expiresIn: CONFIG.JWT_TOKEN.EXPIRY_TIME,
            algorithm: CONFIG.JWT_TOKEN.ALGORITHM
        });
        return decoded;

    }
}

module.exports = new JwtServices();
