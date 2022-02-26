const  eventEmitterListenerCount = require('events').EventEmitter.listenerCount; 



const  util = require('util');
const  EventEmitter = require('events').EventEmitter;
const  http = require('http');
const  https = require('https');
const  url = require('url');
const  crypto = require('crypto');
const  WebSocketConnection = require('websocket').connection;

const {
    protocolSeparators,
    excludedTlsOptions,
} = require("./consts");

const _cfg = require("./cfg");

function WebSocketClient(config) {
    // Superclass Constructor
    EventEmitter.call(this);
    _cfg.init(this,config)
    this._req = null;
}

util.inherits(WebSocketClient, EventEmitter);

const _param = require("./param");

WebSocketClient.prototype.connect = function(requestUrl, protocols, origin, headers, extraRequestOptions) {
    let self = this;
    ////
    this.protocols = _param.fmt_protocols(protocols);
    this.origin = origin;
    this.url = _param.fmt_url(requestUrl);
    this.secure = (this.url.protocol.includes('wss:'));
    this.base64nonce = _param.rand_b64_nonce();
    ////
    let requestOptions = _param.creat_req_opts(this,headers,extraRequestOptions)
    this._req = (this.secure ? https : http).request(requestOptions);
    ////
    let req = this._req
    ////
    function handleRequestError(error) {
        self._req = null;
        self.emit('connectFailed', error);
    }
    ////
    req.on('upgrade', function handleRequestUpgrade(response, socket, head) {
        self._req = null;
        req.removeListener('error', handleRequestError);
        self.socket = socket;
        self.response = response;
        self.firstDataChunk = head;
        self.validateHandshake();
    });
    req.on('error', handleRequestError);
    req.on('response', function(response) {
        self._req = null;
        if (eventEmitterListenerCount(self, 'httpResponse') > 0) {
            self.emit('httpResponse', response, self);
            if (response.socket) {
                response.socket.end();
            }
        } else {
            var headerDumpParts = [];
            for (var headerName in response.headers) {
                headerDumpParts.push(headerName + ': ' + response.headers[headerName]);
            }
            self.failHandshake(
                'Server responded with a non-101 status: ' +
                response.statusCode + ' ' + response.statusMessage +
                '\nResponse Headers Follow:\n' +
                headerDumpParts.join('\n') + '\n'
            );
        }
    });
    req.end();
    return(req)
}


WebSocketClient.prototype.validateHandshake = function() {
    var headers = this.response.headers;
    if (this.protocols.length > 0) {
        this.protocol = headers['sec-websocket-protocol'];
        if (this.protocol) {
            if (this.protocols.indexOf(this.protocol) === -1) {
                this.failHandshake('Server did not respond with a requested protocol.');
                return;
            }
        }
        else {
            this.failHandshake('Expected a Sec-WebSocket-Protocol header.');
            return;
        }
    }

    if (!(headers['connection'] && headers['connection'].toLocaleLowerCase() === 'upgrade')) {
        this.failHandshake('Expected a Connection: Upgrade header from the server');
        return;
    }

    if (!(headers['upgrade'] && headers['upgrade'].toLocaleLowerCase() === 'websocket')) {
        this.failHandshake('Expected an Upgrade: websocket header from the server');
        return;
    }

    var sha1 = crypto.createHash('sha1');
    sha1.update(this.base64nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    var expectedKey = sha1.digest('base64');

    if (!headers['sec-websocket-accept']) {
        this.failHandshake('Expected Sec-WebSocket-Accept header from server');
        return;
    }

    if (headers['sec-websocket-accept'] !== expectedKey) {
        this.failHandshake('Sec-WebSocket-Accept header from server didn\'t match expected value of ' + expectedKey);
        return;
    }

    // TODO: Support extensions

    this.succeedHandshake();
};

WebSocketClient.prototype.failHandshake = function(errorDescription) {
    if (this.socket && this.socket.writable) {
        this.socket.end();
    }
    this.emit('connectFailed', new Error(errorDescription));
};

WebSocketClient.prototype.succeedHandshake = function() {
    var connection = new WebSocketConnection(this.socket, [], this.protocol, true, this.config);
    connection.webSocketVersion = this.config.webSocketVersion;
    connection._addSocketEventListeners();
    this.emit('connect', connection);
    if (this.firstDataChunk.length > 0) {
        connection.handleSocketData(this.firstDataChunk);
    }
    this.firstDataChunk = null;
};

WebSocketClient.prototype.abort = function() {
    if (this._req) {
        this._req.abort();
    }
};

module.exports = WebSocketClient;
