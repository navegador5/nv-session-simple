
const STATES = {
    CONNECTING:0,0:'CONNECTING',
    OPEN:1,1:'OPEN',
    CLOSING:2,2:'CLOSING',
    CLOSED:3,3:'CLOSED'
}
    
const ERRORS = {
    unknown:3001,3001:'unknown',
    keepalive:3002,3002:'keepalive'
}


module.exports = {
    STATES,
    ERRORS
}
