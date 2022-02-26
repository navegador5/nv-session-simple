const {nanoid} = require("nanoid");

const MSG_TYPE ={
	cfg:'___cfg___',
    creq:'___creq___',
    cres:'___cres___',
    sreq:'___sreq___',
    sres:'___sres___',
    ping:'___ping___',
    pong:'___pong___',
}



class Msg {
    constructor(typ,data={},id) {
        this.___type___ = typ;
        this.___id___   = id??nanoid(64);
        this.___data___ = data;
    }
    get type_() {return(this.___type___)}
    get id_()   {return(this.___id___)}
    get data_() {return(this.___data___)}
    is_pair(msg) {
        return(
            this.___type___ === msg.___type___ &&
            this.___req___ === msg.___req___
        )
    }
}


function is_jmsg(s) {
    try {
        let r = JSON.parse(s);
	let cond = (r instanceof Object);    
	return([cond,r])    
    } catch(err) {
        return([false,s])
    }
}

function is_jrr_creq_msg(j) {
    return(j.___type___===MSG_TYPE.creq)
}

function is_jrr_cres_msg(j) {
    return(j.___type___===MSG_TYPE.cres)
}

function is_jrr_sreq_msg(j) {
    return(j.___type___===MSG_TYPE.sreq)
}

function is_jrr_sres_msg(j) {
    return(j.___type___===MSG_TYPE.sres)
}

function is_cfg_msg(j) {
    return(j.___type___===MSG_TYPE.cfg)
}


function is_ping_msg(j) {
    return(j.___type___===MSG_TYPE.ping)
}

function is_pong_msg(j) {
    return(j.___type___===MSG_TYPE.pong)
}


function creat_send_ping_msg(keepalive) {
    let data = JSON.stringify(keepalive);
    let msg = new Msg(MSG_TYPE.ping,data);
    return(JSON.stringify(msg))
}


function creat_send_pong_msg(keepalive) {
    let data = JSON.stringify(keepalive);
    let msg = new Msg(MSG_TYPE.pong,data);
    return(JSON.stringify(msg))
}




const WebSocketConnection = require("./eng");
const {_psj} = require("./nv-browser-promise");


function to_u8ary(data) {
    if(data instanceof Uint8Array) {
        return(data)
    } else if(data instanceof ArrayBuffer) {
        return(new Uint8Array(data))
    } else if(data instanceof Array){
        return(new Uint8Array(data))
    } else if(typeof(data) === 'string') {
        return(new Uint8Array(Array.from(data)))
    } else {
        return(new Uint8Array(data))
    }
}


async function ato_u8ary(data) {
    if(data instanceof Blob) {
        let ab = await data.arrayBuffer();
        return(new Uint8Array(ab))
    } else {
        return(to_u8ary(data))
    }
}

WebSocketConnection.prototype.bsend= function(data) {
    this.send(to_u8ary(data))
}

WebSocketConnection.prototype.ssend= function(data) {
    this.send(String(data))
}


WebSocketConnection.prototype.jsend= function(j) {
    let data = JSON.stringify(j);
    this.send(data)	
}



WebSocketConnection.prototype.assend = function(data) {
    console.log(`useless on browser,same as ssend`)
    this.send(String(data));
}

WebSocketConnection.prototype.absend = async function(data) {
    data = await ato_u8ary(data);
    this.send(data)
}


WebSocketConnection.prototype.ajsend = function(j) {
    console.log(`useless on browser,same as jsend`)
    let data = JSON.stringify(j);
    this.send(data)
}



const ERROR = {
    cant_use_sreq_from_client:'cant_use_sreq_from_client',
    cant_use_cres_from_server:'cant_use_cres_from_server',
    cant_use_creq_from_server:'cant_use_creq_from_server',
    cant_use_sres_from_client:'cant_use_sres_from_client',

}


WebSocketConnection.prototype.send_jrr_sreq = function(j) {
    //需要存入sjrr_queue
    if(this.is_server_) {
        let msg = new Msg(MSG_TYPE.sreq,j); 
        let [p,rs,rj] = _psj();
        let sess = this.sess_;
        sess.sjrr_queue_[msg.___id___] = {rs,rj} 
        this.send(JSON.stringify(msg))	
        return(p)	
    } else {
     	console.log(ERROR.cant_use_sreq_from_client)    
    }
}




WebSocketConnection.prototype.send_jrr_cres = function(j,id) {
    //不可被server端调用
    if(this.is_client_){
        let msg = new Msg(MSG_TYPE.cres,j,id);
        let [p,rs,rj] = _psj();
        this.send(JSON.stringify(msg),(R)=>{rs(R)});
        return(p)
    } else {
	    console.log(ERROR.cant_use_cres_from_server)    
    }
}




WebSocketConnection.prototype.send_jrr_creq = function(j) {
    //需要存入cjrr_queue
    if(this.is_client_) {
        let msg = new Msg(MSG_TYPE.creq,j);
        let [p,rs,rj] = _psj();
        let sess = this.sess_;
        sess.cjrr_queue_[msg.___id___] = {rs,rj}
        /////
        this.send(JSON.stringify(msg))
        return(p)
    } else {
        console.log(ERROR.cant_use_creq_from_server)
    }
}


WebSocketConnection.prototype.send_jrr_sres = function(j,id) {
    //不可被client端调用
    if(this.is_server_){
        let msg = new Msg(MSG_TYPE.sres,j,id);
        let [p,rs,rj] = _psj();
        this.send(JSON.stringify(msg),(R)=>{rs(R)});
        return(p)
    } else {
        console.log(ERROR.cant_use_sres_from_client)
    }
}




module.exports = {
    MSG_TYPE,Msg,
    creat_send_ping_msg,	
    creat_send_pong_msg,
    is_jmsg,
    is_ping_msg,
    is_pong_msg,
    is_cfg_msg,
    ////
    is_jrr_creq_msg, //send -from-client   C-creq->S
    is_jrr_sres_msg, //send -from-server   C<-sres-S
    //////
    is_jrr_sreq_msg, //send -from-server   C<-sreq-S 
    is_jrr_cres_msg, //send -from-client   C-cres->S
    ////
    to_u8ary,
    ato_u8ary,
    ERROR,
}
