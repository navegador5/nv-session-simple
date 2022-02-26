const DFLT_CFG = () =>({
    maxReceivedFrameSize: 0x100000,
    maxReceivedMessageSize: 0x800000,
    fragmentOutgoingMessages: true,
    fragmentationThreshold: 0x4000,
    webSocketVersion: 13,
    assembleFragments: true,
    disableNagleAlgorithm: true,
    closeTimeout: 5000,
    tlsOptions: {}
});

const {extend} = require("./tool");


function init(that,config) {
    that.config = DFLT_CFG();
    if (config) {
        let tlsOptions;
        if (config.tlsOptions) {
          tlsOptions = config.tlsOptions;
          delete config.tlsOptions;
        }
        else {
          tlsOptions = {};
        }
        extend(that.config, config);
        extend(that.config.tlsOptions, tlsOptions);
    }
}

const DFLT_REQ_HEADERS = ()=>({
    'Upgrade': 'websocket',
    'Connection': 'Upgrade',
    'Sec-WebSocket-Version': '13',
    'Sec-WebSocket-Key': 'Ttbym5EzaUFjkHcKvxStnw==',
    'Host': 'localhost' 
});


module.exports = {
   DFLT_CFG, 
   DFLT_REQ_HEADERS, 
   init,
}


