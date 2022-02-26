const url = require("url");

const {protocolSeparators} = require("./consts");

function _validate_protocols(protocols) {
    protocols.forEach(function(protocol) {
        for (var i=0; i < protocol.length; i ++) {
            var charCode = protocol.charCodeAt(i);
            var character = protocol.charAt(i);
            if (charCode < 0x0021 || charCode > 0x007E || protocolSeparators.indexOf(character) !== -1) {
                throw new Error('Protocol list contains invalid character "' + String.fromCharCode(charCode) + '"');
            }
        }
    });
}

function fmt_protocols(protocols) {
    if (typeof(protocols) === 'string') {
        if (protocols.length > 0) {
            protocols = [protocols];
        }
        else {
            protocols = [];
        }
    }
    if (!(protocols instanceof Array)) {
        protocols = [];
    }
    _validate_protocols(protocols);
    return(protocols)
}

const {defaultPorts} = require("./consts");

function _get_protocol(_protocol) {
    let _is_unix = false
    if(_protocol.includes('unix')) {
        _protocol = _protocol.replace(/\+/g,'');
        _protocol = _protocol.replace(/unix/g,'');
        _is_unix = true
    } else {
    }
    return({protocol:_protocol,is_unix:_is_unix})
}

function _verify_url_if_not_unix(url) {
    if (!url.protocol) {
      throw new Error('You must specify a full WebSocket URL, including protocol.');
    }
    if (!url.host) {
        throw new Error('You must specify a full WebSocket URL, including hostname. Relative URLs are not supported.');
    }
}


function fmt_url(requestUrl) {
    let _URL;
    if (typeof(requestUrl) === 'string') {
        _URL = url.parse(requestUrl);
    } else {
        _URL = requestUrl; 
    }
    ////
    let {protocol,is_unix} = _get_protocol(_URL.protocol);
    ////
    if(is_unix) {
       
    } else {
        _verify_url_if_not_unix(_URL)
    }
    ////
    if(is_unix) {
    } else {
        if (!_URL.port) {
            _URL.port = defaultPorts[protocol];
        }
    }
    Object.defineProperty(_URL,'is_unix',{get:function(){return(is_unix)}})
    ////
    return(_URL) 
}


function rand_b64_nonce() {
    var nonce = Buffer.allocUnsafe(16);
    for (var i=0; i < 16; i++) {
        nonce[i] = Math.round(Math.random()*0xFF);
    }
    return(nonce.toString('base64'))
}


function _get_host_head_value(that) {
    var hostHeaderValue = that.url.hostname;
    if (
        (that.url.protocol === 'ws:' && that.url.port !== '80') ||
        (that.url.protocol === 'wss:' && that.url.port !== '443')
    )  {
        hostHeaderValue += (':' + that.url.port);
    }
    return(hostHeaderValue)
}


const {extend} = require("./tool");

const {DFLT_REQ_HEADERS} = require("./cfg");

function _creat_req_headers(that,headers) {
    var reqHeaders = {};
    if (that.secure && that.config.tlsOptions.hasOwnProperty('headers')) {
      extend(reqHeaders, that.config.tlsOptions.headers);
    }
    if (headers) {
       extend(reqHeaders, headers);
    }
    ////
    let dflt = DFLT_REQ_HEADERS();
    dflt['Sec-WebSocket-Version'] = that.config.webSocketVersion.toString(10);
    dflt['Sec-WebSocket-Key'] = that.base64nonce;
    dflt['Host'] = reqHeaders.Host || _get_host_head_value(that);
    //
    extend(reqHeaders, dflt);
    ////
    if (that.protocols.length > 0) {
        reqHeaders['Sec-WebSocket-Protocol'] = that.protocols.join(', ');
    }
    if (that.origin) {
        if (that.config.webSocketVersion === 13) {
            reqHeaders['Origin'] = that.origin;
        }
        else if (that.config.webSocketVersion === 8) {
            reqHeaders['Sec-WebSocket-Origin'] = that.origin;
        }
    }
    ////
    return(reqHeaders)
}

function _get_path_and_query(that) {
    var pathAndQuery;
    // Ensure it begins with '/'.
    if (that.url.pathname) {
        pathAndQuery = that.url.path;
    } else if (that.url.path) {
        pathAndQuery = '/' + that.url.path;
    } else {
        pathAndQuery = '/';
    }
    return(pathAndQuery)
}

const {excludedTlsOptions} = require("./consts");


function creat_req_opts(that,headers,extraRequestOptions) {
    let reqHeaders = _creat_req_headers(that,headers);
    var requestOptions = { agent: false };
    if (extraRequestOptions) {
        extend(requestOptions, extraRequestOptions);
    }
    ////
    if (that.secure) {
        var tlsOptions = that.config.tlsOptions;
        for (var key in tlsOptions) {
            if (tlsOptions.hasOwnProperty(key) && excludedTlsOptions.indexOf(key) === -1) {
                requestOptions[key] = tlsOptions[key];
            }
        }
    }
    ////
    if(that.url.is_unix) {
        extend(requestOptions, {
            method: 'GET',
            headers: reqHeaders,
            socketPath:that.url.path
        });
    } else {
        extend(requestOptions, {
            hostname: that.url.hostname,
            port: that.url.port,
            method: 'GET',
            path: _get_path_and_query(that),
            headers: reqHeaders
        });
    }
    return(requestOptions)
}


module.exports = {
    _validate_protocols,
    fmt_protocols,
    _verify_url_if_not_unix,
    fmt_url,
    rand_b64_nonce,
    _get_host_head_value,
    _creat_req_headers,
    _get_path_and_query,
    creat_req_opts,
}
