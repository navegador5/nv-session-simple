const _C = require('./eng');


const jmsg  = require("../jmsg");
const frame = require("../frame");

const {_psj,ka,wait} = require("nv-facutil-promise");
const {DFLT_CFG} = require("./client-cfg")
const {nanoid} = require("nanoid")
const {is_str,is_regex} = require("nv-facutil-basic");


function _close_one(conn) {
    if(conn) {
        if(conn.socket) {
             if(conn.socket.destroy && !conn.socket.destroyed) {
                 let [p,rs,rj] = _psj();
                 conn.socket.destroy((r,d) => {
                       rs([r,d])
                  });
                  return(p)
             } else {
                 return(Promise.resolve([undefined,undefined]))
             }
        } else {
            return(Promise.resolve([undefined,undefined]))
        }
    } else {
        return(Promise.resolve([undefined,undefined]))
    }
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
        if(this.#conn?.ka_) {
            this.#conn.ka_?.cancel();
        } else {}
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
    is_active() {
        return(this.#conn?.socket?.readyState==='open')
    }
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

const DFLT_CFG_HANDLE = async (j,conn,sess,self) => {
   //debug using
}

const DFLT_BIN_HANDLE = async (length,data,conn,sess,self) => {
    //console.log('Received Binary Message of ' + length + ' bytes');
    // conn.bsend(...)
    //   OR
    // async: await conn.abasend(....)

}


const DFLT_JSON_HANDLE = async (j,conn,sess,self) => {
    //console.log('Received JSON Message of ',j);
    //conn.jsend(...J....);
    //  OR
    //await conn.ajsend(...J...)
}

const DFLT_STR_HANDLE = async (s,conn,sess,self) => {
    //console.log('Received STR Message of ',s);
    //conn.ssend(S);
    //  OR
    //await conn.assend(S)
}

const DFLT_SREQ_HANDLE = async (j,conn,sess,self) => {
    //console.log('Received JSON Message of ',j,sess.cjrr_queue_);
    //await conn.send_jrr_cres(j.___data___,j.___id___) //the second param MUST BE j.___id___
}


const DFLT_CHECK_NETWORK_BEFORE_RECONN = (...params) => true


function add_ka(that,sess,conn) {
      if(that.cfg_.keepalive && that.cfg_.keepaliveInterval) {
         let conn_ka = ka(that.cfg_.keepaliveInterval);
         conn_ka.then(r=>{}).catch(
            err=> {
                let data = jmsg.creat_send_ping_msg(that.cfg_.keepaliveInterval);
                data.___data___ = err
                if(sess.is_active()) {conn.send(data) } else {}
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
                  if(sess.is_active()) {
                      conn.send(kamsg);
                      conn.send_ping_frame();
                  } else {}
             },
             that.cfg_.keepaliveInterval/4
         );
         sess.katsk_ = tsk;
     } else {
     }
}


async function try_auto_reconn(self) {
      if(self.cfg_.autoReconnect === true) {
          if(!self.check_network_before_reconn_()) {
              console.log('not-connected');
          } else {
              console.log('auto-reconn-c');
              try {
                  await self.restart();
              } catch(err) {
              }
          }
      } else {}
}


const DFLT_ON_CLOSE = (reasonCode, description,conn,sess,self)=>{console.log(reasonCode, description)}
const DFLT_ON_ERROR = (reasonCode, description,conn,sess,self)=>{console.log(reasonCode, description)}

const sym_set_sess =Symbol("");
const sym_set_auto_reconn=Symbol("");
const sym_manual_close = Symbol("");



const _wait_connect = (wsrv)=> {
    let [p,rs,rj] = _psj();
    wsrv.on('connectFailed',function(err) {rj(err)});
    wsrv.on('connect',function(conn) {rs(conn)})
    return(p);
}

const OD = Object.defineProperty;

function _add_omethods(conn,sess) {
     OD(conn,'sess_',{get:function(){return(sess)},enumerable:false});
     OD(conn,'is_server_',{get:function(){return(false)},enumerable:false});
     OD(conn,'is_client_',{get:function(){return(true)},enumerable:false});
}


function _try_add_keepalive(self,sess,conn) {
        if(self.cfg_.keepalive === true){
           set_katsk(self,sess,conn);
           add_ka(self,sess,conn);
            ////
           if(sess.is_active()) {
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
        } else {}
}


function _try_add_auto_reconn(self) {
        if(self.cfg_.autoReconnect === true) {
                let intvid= setInterval(
                     async () => {
                         if(self.sess_ === undefined) {
                             //未启动
                         } else if(self.sess_.is_active()) {
                             //如果激活不做任何事
                         } else {
                             if(self[sym_manual_close]===true) {
                                 //手动强制关闭
                             } else if(!self.check_network_before_reconn_()) {
                                 //网络不通
                             } else {
                                 console.log('auto-reconn-g')
                                 try {
                                     await self.restart();
                                 } catch(err) {
                                 }
                             }
                         }
                     },
                     self.cfg_.autoReconnectInterval,
                );
                self[sym_set_auto_reconn](intvid)
        } else {
        }
}



const _creat_internal_message_handler = (self,conn) =>( async (message)=> {
      let sess = conn.sess_;
      if(self.cfg_.keepalive === true) {
          try {conn.ka_.renew();} catch(err) {
              console.log(`just ignore`)
          }
      } else {}
      if (message.type === 'utf8') {
          let [cond,j] = jmsg.is_jmsg(message.utf8Data);
          if(cond) {
              if(jmsg.is_cfg_msg(j)) {
                   self.cfg_handle_(j,conn,sess,self);
              } else if(jmsg.is_pong_msg(j)) {
                  //do-nothing
              } else if(jmsg.is_ping_msg(j)) {
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
})


const _creat_internal_close_handler = (self,conn) =>(
   async function(reasonCode, description) {
      let sess = conn.sess_;
      if(sess!==undefined) {
          sess.clear_katsk();
          sess.clear();
      } else {}
      self.on_close_(reasonCode, description,conn,sess,self);
      ////
      try {await _close_one(conn)} catch(err) {}
      ////
      console.log(`HERE`)
      if(self[sym_manual_close]) {

      } else {
          await try_auto_reconn(self);
      }
  }
)


const _creat_internal_error_handler = (self,conn) => (
    async function(reasonCode, description) {
      let sess = conn.sess_;
      if(sess!==undefined) {
          sess.clear_katsk();
          sess.clear();
      } else {}
      self.on_error_(reasonCode, description,conn,sess,self);
      ////
      try {await _close_one(conn)} catch(err) {}
      ////
      await try_auto_reconn(self);
   }
)



class Client {
    #wsrv = undefined;
    #cfg = DFLT_CFG();
    #url   = undefined;
    #sec_websocket_protocol = undefined;
    #sess  = undefined;
    #on_close = DFLT_ON_CLOSE
    #on_error = DFLT_ON_ERROR
    #cfg_handle  = DFLT_CFG_HANDLE;
    #bin_handle = DFLT_BIN_HANDLE;
    #json_handle = DFLT_JSON_HANDLE;
    #str_handle  = DFLT_STR_HANDLE;
    #sreq_handle = DFLT_SREQ_HANDLE;
    #auto_reconn = undefined;
    #manual_close = false;
    #check_network_before_reconn = DFLT_CHECK_NETWORK_BEFORE_RECONN;
    ////
    get [sym_manual_close]()  {return(this.#manual_close)}
    set [sym_manual_close](v)  {this.#manual_close=v}
    [sym_set_auto_reconn](intvid) {this.#auto_reconn = intvid}
    ////
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
    regis_$check_network_before_reconn$(f=DFLT_CHECK_NETWORK_BEFORE_RECONN,...params) {
        this.#check_network_before_reconn = ()=> {
            DFLT_CHECK_NETWORK_BEFORE_RECONN(...params)
        }
    }
    get check_network_before_reconn_() {return(this.#check_network_before_reconn)}
    //
    regis_$cfg_handle$(f=DFLT_CFG_HANDLE) {
        this.#cfg_handle = f
    }
    get cfg_handle_() {return(this.#cfg_handle)}
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
    async start(url,sec_websocket_protocol=undefined,origin, headers, extraRequestOptions={rejectUnauthorized: false}) {
        this.#url = url;
        this.#sec_websocket_protocol = sec_websocket_protocol;
        try {
                //
                this.#wsrv = new _C(this.#cfg);
                this.#wsrv.connect(url,sec_websocket_protocol,origin, headers, extraRequestOptions);
                //
                this[sym_manual_close] = false;
                let self = this;
                //---begin connedct
                let conn = await _wait_connect(this.#wsrv);                            //
                ////------------------------------------------------------
                let sess = new Sess(this.#wsrv.response,conn);
                self[sym_set_sess](sess);
                _add_omethods(conn,sess);
                _try_add_keepalive(self,sess,conn);
                _try_add_auto_reconn(self);
                ////on-message handler
                conn.on('message',_creat_internal_message_handler(self,conn));
                ////on-close-handler
                conn.on('close',_creat_internal_close_handler(self,conn));
                ////on-error-handler
                conn.on('error',_creat_internal_error_handler(self,conn));
                ////------------------------------------------------------------
                return(conn)
        } catch(err) {
            console.log('conn-fail',err);
            let self = this;
            if(self.cfg_.autoReconnect === true) {
                console.log('auto-reconn-after',self.cfg_.autoReconnectInterval);
                await wait(self.cfg_.autoReconnectInterval);
                return(await self.start(self.#url,self.#sec_websocket_protocol));
            } else {
                return(null)
            }
        }
    }
    ////
    disable_auto_reconn() {this.cfg_.autoReconnect=false}
    enable_auto_reconn()  {this.cfg_.autoReconnect=true}
    ////
    async close(force_close=true) {
        if(force_close) {
            this[sym_manual_close] = true
        } else {
            this[sym_manual_close] = false
        }
        let r = await _close_one(this.sess_.conn_);
        let sess = this.sess_;
        if(sess!==undefined) {
          sess.clear_katsk();
          sess.clear();
        } else {}
        clearInterval(this.#auto_reconn);
        return(r)
    }
    async restart() {
        await this.close(false);
        console.log("restart...")
        let R = await this.start(this.#url,this.#sec_websocket_protocol);
        return(R)
    }
    ////
    get [Symbol.toStringTag]() {
        if(this.wsrv_.url.protocol.includes('unix')) {
            return(
                JSON.stringify({
                    server:this.wsrv_.url.href,
                    local:{
                        localAddress:null,
                        localPort:null
                    }
                },null,2)
            )
        } else {
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
}


module.exports = {
    Client,
    ERROR,
    ////
    DFLT_CFG_HANDLE,
    DFLT_BIN_HANDLE,
    DFLT_STR_HANDLE,
    DFLT_JSON_HANDLE,
    DFLT_SREQ_HANDLE,
    DFLT_ON_CLOSE,
    DFLT_ON_ERROR,
    ////
    DFLT_CHECK_NETWORK_BEFORE_RECONN,
}


