const DFLT_CFG = ()=>({
        httpServer: null,
        maxReceivedFrameSize: 0x10000,
        maxReceivedMessageSize: 0x100000,
        fragmentOutgoingMessages: true,
        fragmentationThreshold: 0x4000,
        keepalive: false,
        keepaliveInterval: 20000,
        dropConnectionOnKeepaliveTimeout: true,
        keepaliveGracePeriod: 10000,
        useNativeKeepalive: false,
        assembleFragments: true,
        autoAcceptConnections: false,
        ignoreXForwardedFor: false,
        parseCookies: true,
        parseExtensions: true,   //false sec-websocket-protocol 
        disableNagleAlgorithm: true,
        closeTimeout: 5000,
        /////
        parallel_conn_rate_limit:5,        //max-parallel connecting request , only affect connecting , will NOT affect DATA send/recv
        parallel_conn_rate_limit_delay:2   //max-parallel connecting request , 2 ms
})


module.exports = {
   DFLT_CFG
}
