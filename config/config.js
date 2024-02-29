const fs = require('fs');

let CONFIG = {};
const PATH = `${__dirname}/data/config.json`;

if (fs.existsSync(PATH)) {
    const data = fs.readFileSync(PATH, { encoding: 'utf8', flag: 'r' });
    try {
        CONFIG = JSON.parse(data);
    } catch (err) {
        console.log(err);
    }
}

module.exports = CONFIG;