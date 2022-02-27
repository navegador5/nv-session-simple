const jmsg  = require("../jmsg");
const WebSocketServer = require('websocket').server;


const http  = require('http');
const https = require('https');
const {psj,ka,wait} = require("nv-facutil-promise");
const {DFLT_CFG} = require("./srv-cfg")
const {nanoid} = require("nanoid")
const {is_str,is_regex} = require("nv-facutil-basic");


const DFLT_HSRV_HANDLER = async function (req,res) {
    res.writeHead(404);
    res.end();
}


const {DFLT_HTTPS_CERT} = require("./cert/index");


function _init_hsrv(that,protocol='http',port=65512,handler=DFLT_HSRV_HANDLER,https_opts=DFLT_HTTPS_CERT()) {
   let hsrv ;
   if(protocol === 'http') {
        hsrv = http.createServer(
            async function(request, response) {
                handler(request, response);
            }
        );
   } else {
       hsrv = https.createServer(
            https_opts,
            async function(request, response) {
                handler(request, response);
            }           
       );
   }
   let [p,rs,rj] = psj()
   hsrv.listen(port, async function(r) {
       console.log(`hsrv started: on ${port}`,r)
       rs(hsrv)
   });
   return(p)
}

function _close_one(conn) {
    let [p,rs,rj] = psj();
    conn.close((r,d) => {
        rs([r,d])
    });
    return(p)
}

const sym_sjrr = Symbol("")

class Sess {
    #req
    #conn
    #id
    #sjrr_queue = {}
    #katsk = undefined
    constructor(req,conn) {
        this.#req = req;
        this.#conn = conn;
        this.#id = nanoid(64);
    }
    get katsk_()   {return(this.#katsk)}
    set katsk_(tsk)   {this.#katsk=tsk}
    clear_katsk()  {
        clearInterval(this.#katsk);
        this.#katsk=undefined;
    }
    is_active() {
         //return(!this.#conn.socket.destroyed)
         return(this.#conn?.socket?.readyState==='open')
    }
    get id_()   {return(this.#id)}
    get req_()  {return(this.#req)}
    get conn_() {return(this.#conn)}
    get sjrr_queue_()   {return(this.#sjrr_queue)}
    [sym_sjrr](recved) {
        let id = recved.___id___;
        let x = this.#sjrr_queue[id];
        if(x!==undefined) {
            x.rs(recved);
            delete this.#sjrr_queue[id];
        } else {
        }
    }
    get [Symbol.toStringTag]() {
        return(
            JSON.stringify({
                    id:this.#id,
                    ////
                    host:this.#req?.host,
                    key:this.#req?.key,
                    origin:this.#req?.origin,
                    cookies:this.#req?.cookies,
                    requestedExtensions:this.#req?.requestedExtensions,
                    query:this.#req?.resourceURL.query,
                    ////
                    conn:(this.#conn?.socket?._peername)??(this.#conn?.socket?._pipeName),
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

const DFLT_CREQ_HANDLE = async (j,conn,sess,self) => {
    //console.log('Received JSON Message of ',j,sess.sjrr_queue_);
    //await conn.send_jrr_sres(....J...,j.___id___)  //the second param MUST BE j.___id___
}


function add_ka(that,sess,conn) {
      if(that.cfg_.keepalive && that.cfg_.keepaliveInterval) {
         let conn_ka = ka(that.cfg_.keepaliveInterval);
         conn_ka.then(r=>{}).catch(
            err=> {
                let data = jmsg.creat_send_ping_msg(that.cfg_.keepaliveInterval);
                data.___data___ = err;
                if(sess.is_active()) {conn.send(data)} else {}
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
                      conn.send(kamsg)
                  } else {
                  }
             },
             that.cfg_.keepaliveInterval/2
         );
         sess.katsk_ = tsk;
     } else {
     }
}


function try_start_ka_and_send_cfg(self,sess,conn) {
    if(self.cfg_.keepalive === true) {
        set_katsk(self,sess,conn);
        add_ka(self,sess,conn);
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
    }  else {}
}


function clear_ka_and_rm_sess_with_conn(self,conn) {
      let sess = conn.sess_;
      if(sess!==undefined) {
          sess.clear_katsk();
          self.sesses_.delete(sess);
      } else {}
}


const {VALI_HREQ_TEM,extract_hreq} =require("./srv-vali");


const sema = require("nv-facutil-simple-sema");

class Server {
    #wsrv = undefined;
    #cfg = DFLT_CFG();
    #verify = (r)=>true;
    #port   = undefined;
    #sec_websocket_protocol = undefined;
    #hsrv_protocol = 'http';
    #https_opts    = DFLT_HTTPS_CERT();
    #sesses = new Map();
    #on_close = (reasonCode, description,conn)=>{console.log('onclose',reasonCode, description)};
    #on_error = (reasonCode, description,conn)=>{console.log('onerror',reasonCode, description)};
    #hsrv_handle = DFLT_HSRV_HANDLER;
    #cfg_handle  = DFLT_CFG_HANDLE;
    #bin_handle = DFLT_BIN_HANDLE;
    #json_handle = DFLT_JSON_HANDLE;
    #str_handle  = DFLT_STR_HANDLE;
    #creq_handle = DFLT_CREQ_HANDLE;
    #sema = undefined;
    get hsrv_()  {return(this.#cfg.httpServer)}
    get wsrv_()  {return(this.#wsrv)}
    get cfg_()   {return(this.#cfg)}
    get sesses_() {return(this.#sesses)}
    sess_filter(condf=(req,conn,id,...params)=>true) {
        let sesses_ = Array.from(this.sesses_.keys())
        return(sesses_.filter(sess=>condf(sess.req,sess.conn,sess.id,...params)))
    }
    rgx_sess_filter(rgx) {
        let sesses_ = Array.from(this.sesses_.keys())
        if(is_str(rgx)) {
            return(sesses_.filter(sess=>JSON.stringify(sess.req).includes(rgx)))
        } else if(is_regex(rgx)) {
             return(sesses_.filter(sess=>rgx.test(JSON.stringify(sess.req))))
        } else {
           return(sesses_)
        }
    }
    get_sess_with_conn(conn) {
         let sesses_ = Array.from(this.sesses_.keys())
         sesses_ = sesses_.filter(sess=>sess.conn_===conn);
         return(sesses_[0])
    }
    ////
    constructor(cfg=DFLT_CFG()) {
        for(let k in cfg) {
            this.#cfg[k] = cfg[k]
        }
        //
        let parallel_conn_rate_limit = this.#cfg.parallel_conn_rate_limit;
        this.#sema = new sema.Simple(parallel_conn_rate_limit);
    }
    //
    get port_()                   {return(this.#port)}
    get sec_websocket_protocol_() {return(this.#sec_websocket_protocol)}
    get hsrv_protocol_()          {return(this.#hsrv_protocol)}
    get https_opts_()             {return(this.#https_opts)}
    //
    regis_$hsrv_handle$(f=DFLT_HSRV_HANDLE) {
        this.#hsrv_handle = f;
    }
    get hsrv_handle_() {return(this.#hsrv_handle)}
    //
    regis_$verify$(f=(r)=>true) {
        this.#verify = f;
    }
    regis_$after_extract_async_verify$(f=async (D)=>true) {
        let _af = async function(r) {
             let D = await extract_hreq(r);
             let cond = await f(D);
             return(cond)
        }
        this.#verify = _af;
    }
    get verify_() {return(this.#verify)}
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
         this.#str_handle = f;
    }
    get str_handle_() {return(this.#str_handle)}
    //
    regis_$creq_handle$(f=DFLT_CREQ_HANDLE) {
         this.#creq_handle = f;
    }
    get creq_handle_() {return(this.#creq_handle)}
    //
    async start(port,sec_websocket_protocol=undefined,hsrv_protocol='http',https_opts=DFLT_HTTPS_CERT()) {
        this.#port = port;
        this.#sec_websocket_protocol = sec_websocket_protocol;
        this.#hsrv_protocol = hsrv_protocol;
        this.#https_opts    = https_opts;
        let hsrv = await _init_hsrv(this,hsrv_protocol,port,this.hsrv_handle_,https_opts);
        this.#cfg.httpServer = hsrv;
        this.#wsrv = new WebSocketServer(this.#cfg);
        let self = this;
        this.#wsrv.on('request',async function(request){
            let vecond = await self.verify_(request);
            if(vecond) {
                ////
                await self.#sema.acquire();
                ////
                let conn = request.accept(sec_websocket_protocol, request.origin);
                let sess = new Sess(request,conn);
                self.sesses_.set(sess,sess.id_);
                ////
                Object.defineProperty(conn,'sess_',{get:function(){return(sess)},enumerable:false});
                Object.defineProperty(conn,'is_server_',{get:function(){return(true)},enumerable:false});
                Object.defineProperty(conn,'is_client_',{get:function(){return(false)},enumerable:false});
                ////
                await wait(self.#cfg.parallel_conn_rate_limit_delay);
                self.#sema.release();            
                ////
                try_start_ka_and_send_cfg(self,sess,conn);
                ////
                conn.on('message', function(message) {
                      let sess = conn.sess_;
                      if(self.cfg_.keepalive===true) {
                          conn.ka_.renew();
                      } else {}
                      if (message.type === 'utf8') {
                          let [cond,j] = jmsg.is_jmsg(message.utf8Data);
                          if(cond) {
                              if(jmsg.is_cfg_msg(j)) {
                                  self.cfg_handle_(j,conn,sess,self); 
                              } else if(jmsg.is_pong_msg(j)) {
                                   //do-nothing 
                              }else if(jmsg.is_ping_msg(j)) {
                                   conn.send(jmsg.creat_send_pong_msg(self.cfg_.keepaliveInterval))
                              } else if(jmsg.is_jrr_creq_msg(j)) {
                                   self.creq_handle_(j,conn,sess,self)
                              } else if(jmsg.is_jrr_sres_msg(j)) {
                                   console.log(jmsg.ERROR.cant_use_sres_from_client)
                              } else if(jmsg.is_jrr_sreq_msg(j)) {
                                   console.log(jmsg.ERROR.cant_use_sreq_from_client)
                              } else if(jmsg.is_jrr_cres_msg(j)) {
                                   sess[sym_sjrr](j)
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
                conn.on('error',async function(reasonCode, description) {
                    clear_ka_and_rm_sess_with_conn(self,conn);
                    self.on_error_(reasonCode, description,conn);
                    await _close_one(conn);
                });
                ////
                conn.on('close', async function(reasonCode, description) {
                      clear_ka_and_rm_sess_with_conn(self,conn);
                      self.on_close_(reasonCode, description,conn)
                });
                ////
            } else {
                 request.reject();
                 return;
            }
        });
    }
    async close() {
        let ps = this.#wsrv.connections.map(conn=>{
            clear_ka_and_rm_sess_with_conn(this,conn);
            return(_close_one(conn))
        });
        let R = await Promise.all(ps);
        this.#wsrv.pendingRequests.forEach(function(request) {
             process.nextTick(function() {
                 request.reject(503);
             })
        });
        return(R)
    }
    async restart() {
        await this.close();
        let R = await this.start(this.#port,this.#sec_websocket_protocol);
        return(R)
    }
    ////
    get [Symbol.toStringTag]() {
        return(
            JSON.stringify({
                    server:this.cfg_?.httpServer?.address(),
                    conns: this.wsrv_?.connections?.map(
                        conn=>(conn?.socket?._peername)??(conn?.socket?.server?._pipeName)
                    )
                },
                null,2
            )
        )
    }
}

//patch

Server.prototype.get_sess = function(idx=0) {
    return(Array.from(this.sesses_.keys())[idx])
}


Server.prototype.fst_sess =  function() {
    return(Array.from(this.sesses_.keys())[0])
}


Server.prototype.lst_sess =  function() {
    let arr = Array.from(this.sesses_.keys())
    return(arr[arr.length-1])
}


////

Server.prototype.get_sess_with_port =  function(port) {
    let arr = Array.from(this.sesses_.keys())
    arr = arr.filter(sess=>sess.conn_.socket._peername.port===port)
    return(arr[0])
}

Server.prototype.jbroadcast_until_any_client_reply = function(j,tmout=15000) {
    let arr = Array.from(this.sesses_.keys())
    arr = arr.map(sess=>sess.conn_);
    if(arr.length !==0) {
        let ps = arr.map(conn=>conn.send_jrr_sreq(j))
        let p = Promise.any(ps);
        let tmp = wait(tmout);
        return(Promise.race([p,tmp]))
    } else {
        return(undefined)
    }
}

Server.prototype.jbroadcast_until_all_client_reply = function(j,tmout=15000) {
    let arr = Array.from(this.sesses_.keys())
    arr = arr.map(sess=>sess.conn_);
    if(arr.length !==0) {
        let ps = arr.map(conn=>conn.send_jrr_sreq(j))
        let p = Promise.all(ps);
        let tmp = wait(tmout);
        return(Promise.race([p,tmp]))
    } else {
        return(undefined)
    }
}

Server.prototype.jbroadcast_ignore_reply = function(j,tmout=15000) {
    let arr = Array.from(this.sesses_.keys());
    arr = arr.map(sess=>sess.conn_);
    if(arr.length !==0) {
        let ps = arr.map(conn=>conn.ajsend(j))
        let p = Promise.all(ps);
        let tmp = wait(tmout);
        return(Promise.race([p,tmp]))
    } else {
        return(undefined)
    }
}



Server.prototype.enable_forward = function () {
     let jforward  =  (j,conn,sess,self)=> {
         let arr = Array.from(this.sesses_.keys());
         let others =  arr.filter(r=>r!==sess);
         others.forEach(sess=> sess.conn_.jsend(j));
     }
     let sforward  =  (s,conn,sess,self) => {
         let arr = Array.from(this.sesses_.keys());
         let others =  arr.filter(r=>r!==sess);
         others.forEach(sess=> sess.conn_.send(s));
     }
     let bforward  =  (blngth,b,conn,sess,self) => {
         let arr = Array.from(this.sesses_.keys());
         let others =  arr.filter(r=>r!==sess);
         others.forEach(sess=> sess.conn_.bsend(b));
     }
     this.regis_$str_handle$(sforward);
     this.regis_$bin_handle$(bforward);
     this.regis_$json_handle$(jforward);
}

Server.prototype.disable_forward = function() {
     this.regis_$str_handle$(DFLT_STR_HANDLE);
     this.regis_$bin_handle$(DFLT_BIN_HANDLE);
     this.regis_$json_handle$(DFLT_JSON_HANDLE);
}


Server.VALI_HREQ_TEM = VALI_HREQ_TEM;
Server.extract_hreq  = extract_hreq;

module.exports = {
    Server,
    ERROR,
    ////
    DFLT_HSRV_HANDLER,
    ////
    DFLT_BIN_HANDLE,
    DFLT_STR_HANDLE,
    DFLT_CFG_HANDLE,
    DFLT_JSON_HANDLE,
    DFLT_CREQ_HANDLE,
    ////
}


