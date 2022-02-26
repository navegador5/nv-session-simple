const WebSocketClient = require('websocket').client;
const jmsg  = require("../jmsg");


const {psj,ka} = require("nv-facutil-promise");
const {DFLT_CFG} = require("./client-cfg")
const {nanoid} = require("nanoid")
const {is_str,is_regex} = require("nv-facutil-basic");


function _close_one(conn) {
    let [p,rs,rj] = psj();
    conn.socket.destroy((r,d) => {
        rs([r,d])
    });
    return(p)
}

const sym_cjrr = Symbol("")

class Sess {
    #res
    #conn
    #id
    #cjrr_queue = {}
    #katsk = undefined
    constructor(res,conn) {
        this.#res = res;
        this.#conn = conn;
        this.#id = nanoid(64);
    }
    get katsk_()   {return(this.#katsk)}
    set katsk_(tsk)   {this.#katsk=tsk}
    clear_katsk()  {
        clearInterval(this.#katsk);
        this.#katsk=undefined;
    }
    get id_()   {return(this.#id)}
    get res_()  {return(this.#res)}
    get conn_() {return(this.#conn)}
    get cjrr_queue_()   {return(this.#cjrr_queue)}
    [sym_cjrr](recved) {
        let id = recved.___id___;
        let x = this.#cjrr_queue[id];
        if(x!==undefined) {
            x.rs(recved);
            delete this.#cjrr_queue[id];
        } else {
        }
    }
    is_active() {return(!this?.#conn?.socket?.destroyed)}
    clear() {
       this.#res = undefined
       this.#conn = undefined
       this.#id = undefined
       this.#cjrr_queue = {}
       this.#katsk = undefined
    }
    get [Symbol.toStringTag]() {
        return(
            JSON.stringify({
                    id:this.#id,
                    server:this?.socket?._peername,
                    url:this.url,
                    local:{
                        localAddress:this.#conn?.socket?.localAddress,
                        localPort:this.#conn?.socket?.localPort
                    }
                },
                null,2
            )
        )
    }
}



const ERROR = {
        only_support_utf8_or_binary_or_json:'only_support_utf8_or_binary_or_json',
}

const DFLT_BIN_HANDLE = (length,data,conn,sess,self) => {
    console.log('Received Binary Message of ' + length + ' bytes');
    conn.sendBytes(data);
}


const DFLT_JSON_HANDLE = (j,conn,sess,self) => {
    console.log('Received JSON Message of ',j);
    //conn.send(JSON.stringify(j));
}

const DFLT_STR_HANDLE = (s,conn,sess,self) => {
    console.log('Received STR Message of ',s);
    conn.send(s);
}

const DFLT_SREQ_HANDLE = (j,conn,sess,self) => {
    console.log('Received JSON Message of ',j);
    conn.send_jrr_cres(j.___data___,j.___id___)
}


function add_ka(that,conn) {
      if(that.cfg_.keepalive && that.cfg_.keepaliveInterval) {
         let conn_ka = ka(that.cfg_.keepaliveInterval);
         conn_ka.then(r=>{}).catch(
            err=> {
                let data = jmsg.creat_send_ping_msg(that.cfg_.keepaliveInterval);
                data.___data___ = err
                conn.send(data);
                setTimeout(()=>{
                    let p = _close_one(conn);
                    p.then(r=>{
                    }).catch(err=>{})
                },0);
            }
         )
         Object.defineProperty(conn,'ka_',{get:function(){return(conn_ka)},enumerable:false})
      } else {}
}

function set_katsk(that,sess,conn) {
     if(that.cfg_.keepalive && that.cfg_.keepaliveInterval) {
         let kamsg = jmsg.creat_send_ping_msg(that.cfg_.keepaliveInterval);
         let tsk = setInterval(
             () => {
                  conn.send(kamsg)
             },
             that.cfg_.keepaliveInterval/2
         );
         sess.katsk_ = tsk;
     } else {
     }
}


const sym_set_sess =Symbol("")

class Client {
    #wsrv = undefined;
    #cfg = DFLT_CFG();
    #url   = undefined;
    #sec_websocket_protocol = undefined;
    #sess  = undefined;
    #on_close = (reasonCode, description,conn)=>{};
    #on_error = (reasonCode, description,conn)=>{};
    #bin_handle = DFLT_BIN_HANDLE;
    #json_handle = DFLT_JSON_HANDLE;
    #str_handle  = DFLT_STR_HANDLE;
    #sreq_handle = DFLT_SREQ_HANDLE;
    get wsrv_()  {return(this.#wsrv)}
    get cfg_()   {return(this.#cfg)}
    get sess_() {return(this.#sess)}
    [sym_set_sess](sess) {this.#sess = sess}
    ////
    constructor(cfg=DFLT_CFG()) {
        for(let k in cfg) {
            this.#cfg[k] = cfg[k]
        }
    }
    //
    get url_()                   {return(this.#url)}
    get sec_websocket_protocol_() {return(this.#sec_websocket_protocol)}
    //
    regis_$on_close$(f=(reasonCode, description,conn)=>{}){
         this.#on_close = f;
    }
    get on_close_() {return(this.#on_close)}
    //
    regis_$on_error$(f=(reasonCode, description,conn)=>{}){
         this.#on_error = f;
    }
    get on_error_() {return(this.#on_error)}
    //
    regis_$bin_handle$(f=DFLT_BIN_HANDLE) {
         this.#bin_handle = f;
    }
    get bin_handle_() {return(this.#bin_handle)}
    //
    regis_$json_handle$(f=DFLT_JSON_HANDLE) {
         this.#json_handle = f;
    }
    get json_handle_() {return(this.#json_handle)}
    //
    regis_$str_handle$(f=DFLT_STR_HANDLE) {
         this.#json_handle = f;
    }
    get str_handle_() {return(this.#str_handle)}
    //
    regis_$sreq_handle$(f=DFLT_SREQ_HANDLE) {
         this.#sreq_handle = f;
    }
    get sreq_handle_() {return(this.#sreq_handle)}
    //
    async start(url,sec_websocket_protocol=undefined) {
        this.#url = url;
        this.#sec_websocket_protocol = sec_websocket_protocol;
        this.#wsrv = new WebSocketClient(this.#cfg);
        this.#wsrv.connect(url,sec_websocket_protocol);
        let wsrv = this.#wsrv;
        let [p,rs,rj] = psj();
        let self = this;
        this.#wsrv.on('connectFailed',function(err) {rj(err)});
        this.#wsrv.on('connect',async function(conn){
                let sess = new Sess(wsrv.response,conn);
                self[sym_set_sess](sess);
                ////
                Object.defineProperty(conn,'sess_',{get:function(){return(sess)},enumerable:false});
                Object.defineProperty(conn,'is_server_',{get:function(){return(false)},enumerable:false});
                Object.defineProperty(conn,'is_client_',{get:function(){return(true)},enumerable:false});
                if(self.cfg_.keepalive === true){
                   set_katsk(self,sess,conn);
                   add_ka(self,conn);
                    ////
                    conn.jsend(
                        {
                            ___type___:'___cfg___',
                            ___data___:{
                                 sessid:sess.id_,
                                 keepaliveInterval:self.cfg_.keepaliveInterval
                            }
                        }
                    );
                } else {}
                ////
                conn.on('message', function(message) {
                      let sess = conn.sess_;
                      if(self.cfg_.keepalive === true) {
                          conn.ka_.renew();
                      } else {}
                      if (message.type === 'utf8') {
                          let [cond,j] = jmsg.is_jmsg(message.utf8Data);
                          if(cond) {
                              if(jmsg.is_ping_msg(j)) {
                                  conn.send(jmsg.creat_send_pong_msg(self.cfg_.keepaliveInterval))
                              } else if(jmsg.is_jrr_creq_msg(j)) {
                                  console.log(jmsg.ERROR.cant_use_creq_from_server)
                              } else if(jmsg.is_jrr_sres_msg(j)) {
                                  sess[sym_cjrr](j)
                              } else if(jmsg.is_jrr_sreq_msg(j)) {
                                  self.sreq_handle_(j,conn,sess,self)
                              } else if(jmsg.is_jrr_cres_msg(j)) {
                                   console.log(jmsg.ERROR.cant_use_cres_from_server)
                              } else {
                                  self.json_handle_(j,conn,sess,self);
                              }
                          } else {
                              self.str_handle_(message.utf8Data,conn,sess,self);
                          }
                      } else if (message.type === 'binary') {
                           self.bin_handle_(message.binaryData.length,message.binaryData,conn,sess,self);
                      } else {
                          console.log(ERROR.only_support_utf8_or_binary_or_json)
                      }
                });
                ////
                conn.on('close', async function(reasonCode, description) {
                      let sess = conn.sess_;
                      if(sess!==undefined) {
                          sess.clear_katsk();
                          sess.clear();
                      } else {}
                      self.on_close_(reasonCode, description,conn)
                });
                ////
                conn.on('error', async function(reasonCode, description) {
                      self.on_error_(reasonCode, description,conn)
                });
                ////
                rs(self);
        });
        return(p)
    }
    async close() {
        let p = _close_one(this.sess_.conn_);
        return(p)
    }
    async restart() {
        await this.close();
        let R = await this.start(this.#url,this.#sec_websocket_protocol);
        return(R)
    }
    ////
    get [Symbol.toStringTag]() {
        return(
            JSON.stringify({
                    server:this.sess_?.conn_?.socket?._peername,
                    local:{
                        localAddress:this.sess_?.conn_?.socket?.localAddress,
                        localPort:this.sess_?.conn_?.socket?.localPort
                    }
                },
                null,2
            )
        )
    }
}


module.exports = {
    Client,
    ERROR,
    ////
    DFLT_BIN_HANDLE,
    DFLT_STR_HANDLE,
    DFLT_JSON_HANDLE,
    DFLT_SREQ_HANDLE,
}

