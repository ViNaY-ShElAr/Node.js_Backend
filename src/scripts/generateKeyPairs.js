const crypto = require('crypto');

// Generate RSA key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Change this value for desired key size
});

// Save keys to files
const fs = require('fs');
fs.writeFileSync('privateKey.pem', privateKey.export({ type: 'pkcs1', format: 'pem' }));
fs.writeFileSync('publicKey.pem', publicKey.export({ type: 'pkcs1', format: 'pem' }));

console.log('Public and Private keys generated successfully!');