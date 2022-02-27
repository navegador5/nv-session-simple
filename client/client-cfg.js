const DFLT_CFG = ()=>({
    maxReceivedFrameSize: 0x100000,
    maxReceivedMessageSize: 0x800000,
    fragmentOutgoingMessages: true,
    fragmentationThreshold: 0x4000,
    webSocketVersion: 13,
    assembleFragments: true,
    disableNagleAlgorithm: true,
    closeTimeout: 5000,
    tlsOptions: {
        rejectUnauthorized: false
    },
    ////
    keepalive:false,
    keepaliveInterval:20000,
    ////
    autoReconnect:true,
    autoReconnectInterval:60000,
})


module.exports = {
   DFLT_CFG
}

