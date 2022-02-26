const {nanoid} = require("nanoid");
const WebSocketFrame  = require('websocket').frame;
const {Buffer} = require("buffer") 

const WebSocketConnection = require("websocket").connection
const {psj} = require("nv-facutil-promise");


function creat_ping_frame() {
    let maskBytesBuffer = Buffer.allocUnsafe(4);
    let frameHeaderBuffer = Buffer.allocUnsafe(10);
    let frameBytes;
    let frame = new WebSocketFrame(maskBytesBuffer, frameHeaderBuffer, {});
    frame.fin = true;
    frame.mask = true;
    frame.opcode = 0x09; // WebSocketFrame.PING
    return(frame)
}


WebSocketConnection.prototype.send_ping_frame= function() {
    this.sendFrame(creat_ping_frame())
}


WebSocketConnection.prototype.asend_ping_frame = function() {
    let [p,rs,rj] = psj();
    this.sendFrame(creat_ping_frame(),(r)=>{rs(r)})
    return(p)
}



module.exports = {
    creat_ping_frame
}
