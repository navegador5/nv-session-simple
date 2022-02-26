const protocolSeparators = [
    '(', ')', '<', '>', '@',
    ',', ';', ':', '\\', '\"',
    '/', '[', ']', '?', '=',
    '{', '}', ' ', String.fromCharCode(9)
];


const excludedTlsOptions = ['hostname','port','method','path','headers'];


const defaultPorts = {
    'ws:': '80',
    'wss:': '443'
};


module.exports = {
    protocolSeparators,
    excludedTlsOptions,
    defaultPorts,
}
