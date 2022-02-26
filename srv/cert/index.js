const fs = require("fs");
const path = require("path");

let key = fs.readFileSync(path.join(__dirname,'https-tst.key'));
let cert = fs.readFileSync(path.join(__dirname,'https-tst.cert'));


const DFLT_HTTPS_CERT = () => {
    return({
        key,
        cert
    })
}

module.exports = {
    DFLT_HTTPS_CERT
}

