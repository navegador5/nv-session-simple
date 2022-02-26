nv-session-simple
=======================
- nv-session-simple : simple wrap of https://www.npmjs.com/package/websocket   
- add some methods for for testbed using
- support unix-socket 
- support dynamic change handler
- support manual mode
- suitable for small scale notification application,such as 2000-4000 online ws/wss connections


install
=======
- npm install nv-session-simple 

usage
=====

      const {Server} = require("nv-session-simple").srv;
      const {Client} = require("nv-session-simple").client;
    
example
-------

### Server 

       const {DFLT_SRV_CFG} = require("nv-session-simple")


       var srv = new Server(DFLT_SRV_CFG)

       fs.unlinkSync("___usock___");
       await srv.start("___usock___");

       srv.enable_forward();

       /*
          in Forwarding  Mode : NO need handler

          //DISABLE Forward
          srv.disable_forward();
          
          // AND  must regis handler , default handler is a empty function

          srv.regis_$json_handle$(

             async (recved_json,conn,sess,self) => {
                console.log('Received JSON Message of ',recved_json);
                //conn.jsend(...J....);
                //  OR
                //await conn.ajsend(...J...)
            }
        )

       */


#### Default server cfg


        {
          httpServer: null,
          maxReceivedFrameSize: 65536,
          maxReceivedMessageSize: 1048576,
          fragmentOutgoingMessages: true,
          fragmentationThreshold: 16384,
          keepalive: true,
          keepaliveInterval: 20000,
          dropConnectionOnKeepaliveTimeout: true,
          keepaliveGracePeriod: 10000,
          useNativeKeepalive: false,
          assembleFragments: true,
          autoAcceptConnections: false,
          ignoreXForwardedFor: false,
          parseCookies: true,
          parseExtensions: true,
          disableNagleAlgorithm: true,
          closeTimeout: 5000,
          parallel_conn_rate_limit: 5,
          parallel_conn_rate_limit_delay: 2
        }




### Client

        
        //---client0
        var c0 = new Client();
        c0.regis_$json_handle$(
            async (recved_json,conn,sess,self) => {
                console.log('client0 Received JSON Message of ',recved_json);
            }
        );


        await c0.start(`ws+unix://${process.cwd()}/___usock___`)

     
       
        //---client1
        var c1 = new Client();
        c1.regis_$json_handle$(
            async (recved_json,conn,sess,self) => {
                console.log('client1 Received JSON Message of ',recved_json);
            }
        );
        await c1.start(`ws+unix://${process.cwd()}/___usock___`)

        
        //---client2
        var c2 = new Client();
        c2.regis_$json_handle$(
            async (recved_json,conn,sess,self) => {
                console.log('client2 Received JSON Message of ',recved_json);
            }
        );
        await c2.start(`ws+unix://${process.cwd()}/___usock___`)


#### Check it on Server

        srv.sesses_

        /*
        > srv.sesses_
        Map(3) {
          Sess [{
          "id": "INvQ9Xzz-RpN6IS7AYAUlYba7mbYWVRPPFQKuew8nL3u-yx2lS45qZU_3dxeY1cA",
          "host": "localhost",
          "key": "K2DYM2dEcI477JObBbNo1Q==",
          "cookies": [],
          "requestedExtensions": [],
          "query": {}
        }] {} => 'INvQ9Xzz-RpN6IS7AYAUlYba7mbYWVRPPFQKuew8nL3u-yx2lS45qZU_3dxeY1cA',
          Sess [{
          "id": "SSQMZ0JfYA10Vke1yWMAA2lNPSdfkdQyRVlgM8To8FoyJLea9I-iKn0tw3Te0xzV",
          "host": "localhost",
          "key": "/pQ3h9z961Bu4wTemnmsVw==",
          "cookies": [],
          "requestedExtensions": [],
          "query": {}
        }] {} => 'SSQMZ0JfYA10Vke1yWMAA2lNPSdfkdQyRVlgM8To8FoyJLea9I-iKn0tw3Te0xzV',
          Sess [{
          "id": "Ju-pEJB53jlcyPyM_Tla9WXf0ITHOvY-h86hURCmwTXRXj_4rzGkAH1gNL7ZZZEr",
          "host": "localhost",
          "key": "kZlqSa4Oq5YT26z9wg6g1A==",
          "cookies": [],
          "requestedExtensions": [],
          "query": {}
        }] {} => 'Ju-pEJB53jlcyPyM_Tla9WXf0ITHOvY-h86hURCmwTXRXj_4rzGkAH1gNL7ZZZEr'
        }
        >

        srv.hsrv_._pipeName
        */


#### Client send message AND be forwarded by server


        await c0.sess_.conn_.ajsend({forward:true,src:'c0'})
        /*
        client1 Received JSON Message of  { forward: true, src: 'c0' }
        client2 Received JSON Message of  { forward: true, src: 'c0' }
        */



        await c1.sess_.conn_.ajsend({forward:true,src:'c1'})
        /*
        client0 Received JSON Message of  { forward: true, src: 'c1' }
        client2 Received JSON Message of  { forward: true, src: 'c1' }
        */

        await c2.sess_.conn_.ajsend({forward:true,src:'c2'})
        /*
        client0 Received JSON Message of  { forward: true, src: 'c2' }
        client1 Received JSON Message of  { forward: true, src: 'c2' }
        */



### HTTPS  just for test, please use  nginx+unix\_sock for https



        > var srv = new Server()
        > await srv.start(8888,undefined,'https');
        hsrv started: on 8888 undefined
        >
        > var c3 = new Client();
        > c3.regis_$json_handle$(
        ...     async (recved_json,conn,sess,self) => {
        .....         console.log('client0 Received JSON Message of ',recved_json);
        .....     }
        ... );
        > await c3.start(`wss://127.0.0.1:8888/a/b`)
        Client [{
          "server": {
            "address": "127.0.0.1",
            "family": "IPv4",
            "port": 8888
          },
          "local": {
            "localAddress": "127.0.0.1",
            "localPort": 48328
          }
        }] {}
        > client0 Received JSON Message of  {
          ___type___: '___cfg___',
          ___data___: {
            sessid: 'ngZ6nxplM84w5LgvdVqZz4SziiTptCO2VG3GRzGXX3g1vE5RRV_EIpZXoj6ZtBRO',
            keepaliveInterval: 20000
          }
        }



### browser


      # npm install nv-session-simple -g
      # nv_sess_bw
         //paste the output to browser
         var Bwsess=(....)()
      

#### browser/server 

        const {Server} = require("nv-session-simple").srv;

        const srv = new Server();
        await srv.start(18888);
        ////----write your handler, 4 kind handler suppoted:
        ////     1. bin  
        ////     2. string  
        ////     3. json  
        ////     4. json-message-must-be-replied: creq_handle, this is for debug-using  AND manual-mode , normally USELESS


        srv.regis_$bin_handle$(
            async (length,data,conn,sess,self) => {
                console.log({
                    length,
                    data
                })
            }
        );
        srv.regis_$str_handle$(
            async (s,conn,sess,self) => {
                console.log('received string',s)
            }
        );
        srv.regis_$json_handle$(
            async (j,conn,sess,self) => {
                console.dir(j,{depth:null})
            }
        );
        srv.regis_$creq_handle$(
            async (j,conn,sess,self) => {
                console.log(`received must reply client req:`,j);
                await conn.send_jrr_sres(
                    {"myreply":"I got IT"},   // any json , must be json
                    j.___id___                //the second param MUST BE j.___id___
                )
            }
        );


#### browser/front


        /*
        Bwsess.DFLT_CFG()
        {
            autoReconnect: true
            keepalive: true                   //coz on browser , can NOT send_ping_frame directly, so USE a special-fromat json for KEEPALIVE
            keepaliveInterval: 20000
        }
        */

        var ws = new Bwsess(Bwsess.DFLT_CFG())
        await ws.start("ws://192.168.1.103:18888")
        //string 
        ws.sess_.conn_.ssend('string')
        //json 
        ws.sess_.conn_.jsend({a:200})
        
        //u8ary
        ws.sess_.conn_.bsend(new Uint8Array([10,20,30]))

        //array-buffer
        var ab = new ArrayBuffer(4)
        var view   = new Int32Array(ab);
        ws.sess_.conn_.bsend(ab)

        //blob
        var debug = {hello: "world"};
        var blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});

        await ws.sess_.conn_.absend(blob)                                                       // =====>blob must use absend and await

        //for binary data, send uint8ary is best , for exzample, server-send v8.deserialized data,  and browser extract-with-post-message inner API

 


        /*
            on server
        > {
          ___type___: '___cfg___',
          ___data___: {
            sessid: '5-EfN5za_yJ8nF7WtISBSoLCRzZyyc7ufAwret1dXIIbp3Cr1Uy5FNVNw7hD-NDh',
            keepaliveInterval: 20000
          }
        }


        string
        { a: 200 }
        { length: 3, data: <Buffer 0a 14 1e> }
        { length: 4, data: <Buffer 00 00 00 00> }
        {
          length: 22,
          data: <Buffer 7b 0a 20 20 22 68 65 6c 6c 6f 22 3a 20 22 77 6f 72 6c 64 22 0a 7d>
        }
        > Buffer.from("7b0a20202268656c6c6f223a2022776f726c64220a7d","hex").toString()
        '{\n  "hello": "world"\n}'
        >

        */



#### send jrr\_creq   which must be replied from server  AND must be json
- jrr is a simple-internal dict-rr-queue 
- this is for debug AND manual mode
- normally USELESS


#####

        await ws.sess_.conn_.send_jrr_creq({kkkk:'hi'})
        /*
        {
            "___type___": "___sres___",
            "___id___": "khC6NStjUTNTxzGn1KJp2q-OPvCLPS0UkcE-uBF-eQbZEfpGk8lpSllwWK8RI2r-",
            "___data___": {
                "myreply": "I got IT"
            }
        }
        */

        //on server
        /*
        received must reply client req: {
          ___type___: '___creq___',
          ___id___: 'khC6NStjUTNTxzGn1KJp2q-OPvCLPS0UkcE-uBF-eQbZEfpGk8lpSllwWK8RI2r-',
          ___data___: { kkkk: 'hi' }
        }
        */


#### reply jrr\_sreq    which must reply from client 

        ws.regis_$sreq_handle$(
            async (j,conn,sess,self) => {
                console.log(`received must reply client req:`,j);
                /*
                   
                    await conn.send_jrr_cres(
                        {"client-reply":"I got IT"},   // any json , must be json
                        j.___id___                //the second param MUST BE j.___id___
                     )
                */
                /*
                    IF use manual-mode, this sreq_handle SHOULD be a empty function ONLY-WITH log(to get the j.___id___)
                */
            }
        );

        //on server
         var sess = srv.lst_sess()
         await sess.conn_.send_jrr_sreq({'hi':'you must reply'})
        //stucked .... AND client must reply


        //on client
        /*
        {
            "___type___": "___sreq___",
            "___id___": "qi71fHAsKALCqSX4F7YeforJ1k-tmqzkoz_FhE4jgnwOrCD3CcjQ_mK1qwqLUcLc",
            "___data___": {
                "hi": "you must reply"
            }
        }

        */

        await ws.sess_.conn_.send_jrr_cres(
           {'some-key':'Client Got It,you can go on'},
           "qi71fHAsKALCqSX4F7YeforJ1k-tmqzkoz_FhE4jgnwOrCD3CcjQ_mK1qwqLUcLc"
        )

        //on server

        {
          ___type___: '___cres___',
          ___id___: 'qi71fHAsKALCqSX4F7YeforJ1k-tmqzkoz_FhE4jgnwOrCD3CcjQ_mK1qwqLUcLc',
          ___data___: { 'some-key': 'Client Got It,you can go on' }
        }
>

### about special jrr message ,its for debug AND manual mode:

#### server

        //on server:
            srv.regis_$creq_handle$(
                 async function(j,conn,sess,self) {
                     //await conn.send_jrr_sres(some-json,j.___id___)
                 }
            );
            
            //sess is from srv.sesses_   ; use srv.sess_filter OR srv.rgx_sess_filter  TO get the-wanted-sess

            sess.conn_.send_jrr_sreq(j)
            sess.conn_.send_jrr_sres(j,id)  //id is from client j.___id___


#### client OR browser


        //on client:
            c.regis_$sreq_handle$(
                 async function(J,conn,sess,self) {
                     //await conn.send_jrr_sres(some-json,J.___id___)

                 }
            )
            c.sess_.conn_.send_jrr_creq(j)
            c.sess_.conn_.send_jrr_cres(j,id)  //id is from server J.___id___


CLI
====
- npm install nv-session-simple -g

### nv\_sess\_bw  

- output Bwsess  for browser 


### nv\_sess\_internal\_srv 

        Usage: nv_sess_internal_srv [options]
        Options:
            -U, --nginx_user                    nginx user, default www-data
            -c, --sec_websocket_protocol        second websocket protocol,default undefined
            -k, --internal_is_usock             internal using unix_sock,defualt true
            -F, --forward                       server is for forwarding, default false
            -u, --internal_usock                unix_sock path, default ./___usock___
            -p, --internal_port                 internal proxy_pass port,default empty string, USELESS if using usock
            -S, --internal_ssl                  internal ssl, default false
            -C, --internal_ssl_cert             ssl cert
            -K, --internal_ssl_key              ssl key
            -h, --help                          usage

        ---example----
        {
          sec_websocket_protocol: undefined,
          forward: false,
          internal_is_usock: true,
          internal_usock: undefined,
          nginx_user: 'www-data',
          internal_ssl: false,
          internal_ssl_cert: '/usr/lib/node_modules/nv-session-simple/srv/cert/https-tst.cert',
          internal_ssl_key: '/usr/lib/node_modules/nv-session-simple/srv/cert/https-tst.key',
          internal_port: 65512
        }

####  usock mode

        # mkdir sess-isrv
        # cd sess-isrv
        # nv_sess_internal_srv

        # ls -l
        # -rw-r--r-- 1 root root 1536 Feb 22 04:28 srv.js
        # cat srv.js
        /*
              # cat srv.js


              const fs = require('fs');
              const chown_with_name = require("nv-cli-user").chown_with_name;
              try {fs.unlinkSync("/opt/JS/nvsess/sess-isrv/___usock___")} catch(err) {};
              const {Server} = require("nv-session-simple").srv;
              const srv = new Server();



              //---your binary handler
              srv.regis_$bin_handle$(
                  async (length,data,conn,sess,self) => {
                      //console.log({length,data})
                      //    data is Buffer
                      //conn.bsend(buf:Buffer)
                      // OR
                      //await conn.absend(buf:Buffer)
                  }
              );


              //---your string handler
              srv.regis_$str_handle$(
                  async (s,conn,sess,self) => {
                      //console.log('received string',s)
                      //    s is string
                      //conn.ssend(str:String)
                      //  OR
                      //await conn.assend(str:String)
                  }
              );


              //----your json handler
              srv.regis_$json_handle$(
                  async (j,conn,sess,self) => {
                      //console.dir(j,{depth:null})
                      //    j is json
                      //conn.jsend(J:JSON)
                      //   OR
                      //await conn.ajsend(J:JSON)
                  }
              );


              //----your creq_handle


              srv.regis_$creq_handle$(
                  async (j,conn,sess,self) => {
                      //console.log("received must reply client req:",j);
                      //await conn.send_jrr_sres(
                      //    {"myreply":"I got IT"},   // any json , must be json
                      //    j.___id___                //the second param MUST BE j.___id___
                      //)
                  }
              );



              module.exports = async () => {
                   await srv.start("/opt/JS/nvsess/sess-isrv/___usock___",undefined);
                   chown_with_name("/opt/JS/nvsess/sess-isrv/___usock___","www-data");
                   return(srv)
              }
        */

        /*
        > const srv = await require("./srv")();
          hsrv started: on /opt/JS/nvsess/sess-isrv/___usock___ undefined
        >
        */

####  port mode

      # nv_sess_internal_srv -k false -p 18889
      # cat srv.js
      /*
         .....
         module.exports = async () => {
             await srv.start(18889,undefined,undefined);
             return(srv)
         }
         ......
      */



###  nv\_sess\_internal\_client

     Usage: nv_sess_internal_client [options]
     Options:
         -c, --sec_websocket_protocol        second websocket protocol,default undefined
         -k, --internal_is_usock             internal using unix_sock,defualt true
         -u, --internal_usock                unix_sock path, default ./___usock___
         -p, --internal_port                 internal proxy_pass port,default empty string, USELESS if using usock
         -S, --internal_ssl                  internal ssl, default false,USELESS if using usock
         -h, --help                          usage
     
     ---example----
     {
       sec_websocket_protocol: undefined,
       internal_is_usock: true,
       internal_usock: undefined,
       internal_ssl: false,
       internal_port: 65512
     }

     # nv_sess_internal_srv          //generate srv.js 
     # nv_sess_internal_client       //same params with nv_sess_internal_srv, in same directory
     /*
         module.exports = async () => {
              const {Client} = require("nv-session-simple").client;
              const  c = new Client();
         ////<-----
         
         //---your binary handler
         c.regis_$bin_handle$(
             async (length,data,conn,sess,self) => {
                 //console.log({length,data})
                 //    data is Buffer
                 //conn.bsend(buf:Buffer)
                 // OR
                 //await conn.absend(buf:Buffer)
             }
         );
         
         
         //---your string handler
         c.regis_$str_handle$(
             async (s,conn,sess,self) => {
                 //console.log('received string',s)
                 //    s is string
                 //conn.ssend(str:String)
                 //  OR
                 //await conn.assend(str:String)
             }
         );
         
         
         //----your json handler
         c.regis_$json_handle$(
             async (j,conn,sess,self) => {
                 //console.dir(j,{depth:null})
                 //    j is json
                 //conn.jsend(J:JSON)
                 //   OR
                 //await conn.ajsend(J:JSON)
             }
         );
         
         
         //----your creq_handle
         
         
         c.regis_$sreq_handle$(
             async (j,conn,sess,self) => {
                 //console.log("received must reply server req:",j);
                 //await conn.send_jrr_cres(
                 //    {"myreply":"I got IT"},   // any json , must be json
                 //    j.___id___                //the second param MUST BE j.___id___
                 //)
             }
         );
         
         
         ////----->
              await c.start("ws+unix:///opt/JS/nvsess/sess-isrv/___usock___",undefined);
              return(c)
         }

     */
     
     const srv = await require("./srv")();
     var c0 = await require("./iclient")();
     var c1 = await require("./iclient")();
     var c2 = await require("./iclient")();
     
     > srv
     Server [{
       "server": "/opt/JS/nvsess/sess-isrv/___usock___",
       "conns": [
         "/opt/JS/nvsess/sess-isrv/___usock___",
         "/opt/JS/nvsess/sess-isrv/___usock___",
         "/opt/JS/nvsess/sess-isrv/___usock___"
       ]
     }] {}
     >


###  nv\_sess\_nginx 

      /*
      # nv_sess_nginx -h
      Usage: nv_sess_nginx [options]
      Options:
          -I, --external_ip              external ip listen on,default 192.168.1.103
          -P, --external_port            external port listen on,default empty string
          -R, --external_route           external route, default us "/"
          -S, --external_ssl             external ssl, default true
          -C, --external_ssl_cert        ssl cert
          -K, --external_ssl_key         ssl key
          -T, --external_http2           external using http2, default false
          -k, --internal_is_usock        internal using unix_sock,defualt true
          -u, --internal_usock           unix_sock path, default ./___usock___
          -i, --internal_ip              internal proxy_pass ip, default 127.0.0.1,USELESS if using usock
          -p, --internal_port            internal proxy_pass port,default empty string, USELESS if using usock
          -r, --internal_route           internal proxy_pass route,default "/",USELESS if using usock
          -h, --help                     usage
      
      ---example----
      {
        external_ip: '192.168.1.103',
        external_port: '',
        external_route: '/',
        external_ssl: true,
        external_ssl_cert: '/usr/lib/node_modules/nv-session-simple/srv/cert/https-tst.cert',
        external_ssl_key: '/usr/lib/node_modules/nv-session-simple/srv/cert/https-tst.key',
        external_http2: false,
        internal_is_usock: true,
        internal_usock: undefined,
        internal_ip: '127.0.0.1',
        internal_port: 65512,
        internal_route: '/'
      }
      */
      
         # nv_sess_internal_srv          //generate srv.js 

         # nv_sess_nginx -I 192.168.1.103 -P 18888 -C /home/dev/BROWSER/jstest/cert/ssl.crt -K /home/dev/BROWSER/jstest/cert/ssl.key
         # //same params with nv_sess_internal_srv, in same directory


        #----worker_rlimit_nofile---
        worker_rlimit_nofile 60000
        #----events---

        events {
            worker_connections 60000;
            # multi_accept on;
        }

         
         #----$http_upgrade-----
         
         map $http_upgrade $connection_upgrade {
             default upgrade;
             ''      close;
         }
         
         #-----server-----
         
             server {
                 listen 192.168.1.103:18888 ssl ;
                 ssl_certificate /home/dev/BROWSER/jstest/cert/ssl.crt;
                 ssl_certificate_key /home/dev/BROWSER/jstest/cert/ssl.key;
                 location / {
                     proxy_pass http://unix:/opt/JS/nvsess/sess-isrv/___usock___;
         
                     proxy_http_version 1.1;
                     proxy_set_header Upgrade $http_upgrade;
                     proxy_set_header Connection $connection_upgrade;
                     proxy_set_header Host $host;
                     proxy_set_header X-Real-IP       $remote_addr;
                     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         
                 }
             }
        # paste to right-position ofnginx.conf  AND then nginx -s reload



###  nv\_sess\_external\_client

        # nv_sess_external_client -h
        Usage: nv_sess_external_client [options]
        Options:
            -c, --sec_websocket_protocol        second websocket protocol,default undefined
            -I, --external_ip                   external ip listen on,default 192.168.1.103
            -P, --external_port                 external port listen on,default empty string
            -R, --external_route                external route, default us "/"
            -S, --external_ssl                  external ssl, default true
            -h, --help                          usage

        ---example----
        {
          sec_websocket_protocol: undefined,
          external_ssl: true,
          external_ip: '192.168.1.103',
          external_port: 65512,
          external_route: '/'
        }


     # nv_sess_internal_srv
     # nv_sess_nginx -I 192.168.1.103 -P 18889  -C /home/dev/BROWSER/jstest/cert/ssl.crt -K /home/dev/BROWSER/jstest/cert/ssl.key
     # modify nginx.conf AND then nginx -s reload

     /*
        const srv = await require("./srv")();
     */
     # goto another client-machine
     # npm install nv-session-simple -g
     # mkdir eclient
     # cd eclient
     # nv_sess_external_client -I 192.168.1.103 -P 18889
     /*
          root@dev2:/opt/JS/eclient# cat eclient.js


          module.exports = async () => {
               const {Client} = require("nv-session-simple").client;
               const  c = new Client();
          ////<-----

          //---your binary handler
          c.regis_$bin_handle$(
              async (length,data,conn,sess,self) => {
                  //console.log({length,data})
                  //    data is Buffer
                  //conn.bsend(buf:Buffer)
                  // OR
                  //await conn.absend(buf:Buffer)
              }
          );


          //---your string handler
          c.regis_$str_handle$(
              async (s,conn,sess,self) => {
                  //console.log('received string',s)
                  //    s is string
                  //conn.ssend(str:String)
                  //  OR
                  //await conn.assend(str:String)
              }
          );


          //----your json handler
          c.regis_$json_handle$(
              async (j,conn,sess,self) => {
                  //console.dir(j,{depth:null})
                  //    j is json
                  //conn.jsend(J:JSON)
                  //   OR
                  //await conn.ajsend(J:JSON)
              }
          );


          //----your creq_handle


          c.regis_$sreq_handle$(
              async (j,conn,sess,self) => {
                  //console.log("received must reply server req:",j);
                  //await conn.send_jrr_cres(
                  //    {"myreply":"I got IT"},   // any json , must be json
                  //    j.___id___                //the second param MUST BE j.___id___
                  //)
              }
          );


          ////----->
               await c.start("wss://192.168.1.103:18889/",undefined);
               return(c)
          }
     */
     /*
         > var c0  = await require("./eclient")()
         > var c1  = await require("./eclient")()
         > var c2  = await require("./eclient")()
         > c0
         Client [{
           "server": {
             "address": "192.168.1.103",
             "family": "IPv4",
             "port": 18889
           },
           "local": {
             "localAddress": "192.168.1.105",
             "localPort": 56816
           }
         }] {}
         >
     */
     //on server
       > srv
       Server [{
         "server": "/opt/JS/nvsess/sess-isrv/___usock___",
         "conns": [
           "/opt/JS/nvsess/sess-isrv/___usock___",
           "/opt/JS/nvsess/sess-isrv/___usock___",
           "/opt/JS/nvsess/sess-isrv/___usock___"
         ]
       }] {}
       >
       srv.regis_$json_handle$(async (j,conn,sess,self) => {console.log(j)})

     // on eclient :
       > await c1.sess_.conn_.ajsend([10,20,30])
     // on server :
     > [ 10, 20, 30 ]


###  nv\_sess\_bclient

     # nv_sess_bclient -h
     /*
         Usage: nv_sess_bclient [options]
         Options:
             -n, --creat_func_name               creat_func_name, default bwsess_connect
             -c, --sec_websocket_protocol        second websocket protocol,default undefined
             -I, --external_ip                   external ip listen on,default 192.168.1.103
             -P, --external_port                 external port listen on,default empty string
             -R, --external_route                external route, default us "/"
             -S, --external_ssl                  external ssl, default true
             -h, --help                          usage

         ---example----
         {
           creat_func_name: 'bwsess_connect',
           sec_websocket_protocol: undefined,
           external_ssl: true,
           external_ip: '192.168.1.103',
           external_port: 65512,
           external_route: '/'
         }
     */


     # nv_sess_bw
     # -- to get the code of Bwsess AND paste it to browser/CDN

     # nv_sess_internal_srv
     # nv_sess_nginx -I 192.168.1.103 -P 18889  -C /home/dev/BROWSER/jstest/cert/ssl.crt -K /home/dev/BROWSER/jstest/cert/ssl.key

     # nv_sess_bclient -I 192.168.1.103 -P 18889
     /*
         root@dev2:/opt/JS/eclient# cat bclient.js

         async function bwsess_connect () {
              const  c = new Bwsess();
         ////<-----

         //---your binary handler
         c.regis_$bin_handle$(
             async (length,data,conn,sess,self) => {
                 //console.log({length,data})
                 //    data is Buffer
                 //conn.bsend(buf:Buffer)
                 // OR
                 //await conn.absend(buf:Buffer)
             }
         );


         //---your string handler
         c.regis_$str_handle$(
             async (s,conn,sess,self) => {
                 //console.log('received string',s)
                 //    s is string
                 //conn.ssend(str:String)
                 //  OR
                 //await conn.assend(str:String)
             }
         );


         //----your json handler
         c.regis_$json_handle$(
             async (j,conn,sess,self) => {
                 //console.dir(j,{depth:null})
                 //    j is json
                 //conn.jsend(J:JSON)
                 //   OR
                 //await conn.ajsend(J:JSON)
             }
         );


         //----your creq_handle


         c.regis_$sreq_handle$(
             async (j,conn,sess,self) => {
                 //console.log("received must reply server req:",j);
                 //await conn.send_jrr_cres(
                 //    {"myreply":"I got IT"},   // any json , must be json
                 //    j.___id___                //the second param MUST BE j.___id___
                 //)
             }
         );


         ////----->
              await c.start("wss://192.168.1.103:18889/",undefined);
              return(c)
         }

         root@dev2:/opt/JS/eclient#
     */
      // in browser
         var c0  = await bwsess_connect()
         var c1  = await bwsess_connect()
         var c2  = await bwsess_connect()
         /*
              E {#t: WebSocket, #e: {…}, #n: 'wss://192.168.1.103:18889/', #s: undefined, #r: Ne, …}
              c0.sess_.is_active()
              true
              c0.sess_.conn_.jsend([88888])
         */
      //on server
      /*
         > srv.sesses_
         Map(3) {
           Sess [{
           "id": "oNUTl4UoaWG9pBZxOSeATluQtx8V29HXqSR2nvsjDZ_nqLYIwznUcRHzsHc3exCM",
           "host": "192.168.1.103",
           "key": "Vq2WibQvxPmcyErTzbGJTQ==",
           "origin": "chrome://new-tab-page",
           "cookies": [],
           "requestedExtensions": [
             {
               "name": "permessage-deflate",
               "params": [
                 {
                   "name": "client_max_window_bits"
                 }
               ]
             }
           ],
           "query": {}
         }] {} => 'oNUTl4UoaWG9pBZxOSeATluQtx8V29HXqSR2nvsjDZ_nqLYIwznUcRHzsHc3exCM',
           Sess [{
           "id": "t126zI2RvEGZ92BmyEdAA2RJUdfwecGViml9yH0fijwM8maYx7OtmV58XgWVrwwt",
           "host": "192.168.1.103",
           "key": "54PYaTcnJbD5MAeLwJZ34w==",
           "origin": "chrome://new-tab-page",
           "cookies": [],
           "requestedExtensions": [
             {
               "name": "permessage-deflate",
               "params": [
                 {
                   "name": "client_max_window_bits"
                 }
               ]
             }
           ],
           "query": {}
         }] {} => 't126zI2RvEGZ92BmyEdAA2RJUdfwecGViml9yH0fijwM8maYx7OtmV58XgWVrwwt',
           Sess [{
           "id": "QA2Kog1E0jMFOqgSfJ3McM_meogiOTwCRc2J06ysCVJ5O4wSIr2VTk6EONQ7Swx5",
           "host": "192.168.1.103",
           "key": "9SPstq9AFSp8HCpZXDLTeA==",
           "origin": "chrome://new-tab-page",
           "cookies": [],
           "requestedExtensions": [
             {
               "name": "permessage-deflate",
               "params": [
                 {
                   "name": "client_max_window_bits"
                 }
               ]
             }
           ],
           "query": {}
         }] {} => 'QA2Kog1E0jMFOqgSfJ3McM_meogiOTwCRc2J06ysCVJ5O4wSIr2VTk6EONQ7Swx5'
         }

         > [ 88888 ]

         >
      */


### nv\_sess\_app 
       
        # nv_sess_app -h 

        Usage: nv_sess_app [options]
        Options:
            -I, --external_ip                   external ip listen on,default 192.168.1.103
            -P, --external_port                 external port listen on,default empty string
            -R, --external_route                external route, default us "/"
            -C, --external_ssl_cert             ssl cert
            -K, --external_ssl_key              ssl key
            -T, --external_http2                external using http2, default false
            -u, --internal_usock                unix_sock path, default ./___usock___
            -U, --nginx_user                    nginx user, default www-data
            -c, --sec_websocket_protocol        second websocket protocol,default undefined
            -F, --forward                       server is for forwarding, default false
            -n, --creat_func_name               creat_func_name, default bwsess_connect
            -h, --help                          usage

        ---example----
        {
          external_ip: '192.168.1.103',
          external_port: '18890',
          external_route: '/',
          external_ssl_cert: '/opt/JS/NV5_/nvsess-/pkgs/srv/cert/https-tst.cert',
          external_ssl_key: '/opt/JS/NV5_/nvsess-/pkgs/srv/cert/https-tst.key',
          external_http2: false,
          internal_usock: undefined,
          sec_websocket_protocol: undefined,
          forward: false,
          nginx_user: 'www-data',
          creat_func_name: 'bwsess_connect'
        }


#### 

       #mkdir sess-isrv
       #cd    sess-isrv

       # nv_sess_app -I 192.168.1.103 -P 18890\
                     -C /opt/JS/NV5_/nvsess-/pkgs/srv/cert/https-tst.cert\
                     -K /opt/JS/NV5_/nvsess-/pkgs/srv/cert/https-tst.key
                     -F 

       //-F means server in forwarding-mode(no need assign handler on server)

       // will generate some files
       # ls -l 
        -rw-r--r-- 1 root     root      1252 Feb 22 11:32 bclient.js
        -rw-r--r-- 1 root     root     14806 Feb 22 11:32 bwcls.js
        -rw-r--r-- 1 root     root      1308 Feb 22 11:32 eclient.js
        -rw-r--r-- 1 root     root      1327 Feb 22 11:32 iclient.js
        -rw-r--r-- 1 root     root       757 Feb 22 11:32 nginx.conf.part
        -rw-r--r-- 1 root     root       878 Feb 22 14:57 srv.js
        -rw-r--r-- 1 root     root       796 Feb 22 15:04 tst-browser.js
        -rw-r--r-- 1 root     root       816 Feb 22 15:13 tst-eclient.js
        -rw-r--r-- 1 root     root        82 Feb 22 15:02 tst-server-and-iclient.js


#### prepare.

      //some sys-params maybe need changing to keep the server stable:

##### tcp AND file

        echo "* - nofile 1048576" >> /etc/security/limits.conf

        echo "fs.file-max = 1048576" >> /etc/sysctl.conf


        echo "net.ipv4.ip_local_port_range = 1024 65535" >> /etc/sysctl.conf
        echo "net.ipv4.tcp_mem = 786432 2097152 3145728" >> /etc/sysctl.conf
        echo "net.ipv4.tcp_rmem = 4096 4096 16777216" >> /etc/sysctl.conf
        echo "net.ipv4.tcp_wmem = 4096 4096 16777216" >> /etc/sysctl.conf

##### ulimit 

        ulimit -n 60000          


##### node 

       node --nouse-idle-notification   --expose-gc  --max-old-space-size=8192   ./server.js

       const GC = setInterval(()=> {gc()},60000});  //auto force GC every minute





#### 0.  copy nginx.conf.part  to correct-position of your-nginx-conf-path

         # nginx -s reload 



#### 1.  enable server AND one-internal-client


         const srv  = await require("./srv")();
         const ctrl = await require("./iclient")();


#### 2.  open 5~10 TAB of you browser , copy bwcls.js bclient.js  tst-browser.js  to each tab of your broswer


          /*
          var Bwsess=(....);
          async function bwsess_connect () {.....}
          
           function tst(count=255) {
                    var jhandle = async function(j,conn,sess,self) {
                         if(j.___type___!== '___cfg___') {
                             console.dir(j,{depth:null})
                         } else {}
                    }
                    const wait = (delay)=> {
                        let p = new Promise(
                            (rs,rj)=> {
                                setTimeout(
                                    ()=> {rs()},
                                    delay
                                )
                            }
                        );
                        return(p)
                    }
                    (async function () {
                        for(let i=0;i<count;i++) {
                            window[`c${i}`] = await bwsess_connect();
                            let c = window[`c${i}`];
                            await wait(10)
                        }
                        for(let i=0;i<count;i++) {
                            let c = window[`c${i}`];
                            c.regis_$json_handle$(jhandle);
                        }
                    })();
           
           }

          
          */
		 
		 //open 20~25 session in each TAB 
         //total 255(depends on browser,I tested on chrome AND edge)
         //    if open too many in one browser
         //    some connectons will be pending , some will disconn AND auto reconnect
         // 
         other test steps similiar to eclient

#### 3.   goto another client-machine  cp eclient.js and tst-eclient.js 

                 # scp root@192.168.1.103://opt/JS/nvsess/sess-isrv/eclient.js eclient.js
                 # scp root@192.168.1.103://opt/JS/nvsess/sess-isrv/tst-eclient.js tst-eclient.js
                 
                 /*
                 function tst(count=2000) {
                          var jhandle = async function(j,conn,sess,self) {
                                 if(j.___type___!== '___cfg___') {
                                     console.dir(j,{depth:null})
                                 } else {}
                          }
                          const wait = (delay)=> {
                              let p = new Promise(
                                  (rs,rj)=> {
                                      setTimeout(
                                          ()=> {rs()},
                                          delay
                                      )
                                  }
                              );
                              return(p)
                          }
                          (async function () {
                              for(let i=0;i<count;i++) {
                                  global[`c${i}`] = await require("./eclient")();
                                  let c = global[`c${i}`];
                                  await wait(5)
                              }
                              for(let i=0;i<count;i++) {
                                  let c = global[`c${i}`];
                                  c.regis_$json_handle$(jhandle);
                              }
                          })();
                 
                 }
                 
                 //---------------make 4000 external connections to Server
                 tst(4000)
                 */
                 
                 //on server
                 
                 > srv.sesses_.size
                 4001
                 >
                 
                //use ctrl to send a message to server,which will be forwarded to all other clients   
                
                
                //on eclient:
                ....
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                { action: 'say hello to your left-sib!' }
                ....
                
                
#### 4.  try send serialized data 
    
            

    //on eclient:
    var mp;
    var bhandle = async function(length,bytes,conn,sess,self) {    
          console.log("length:",length);
          let r = v8.deserialize(bytes);
          mp = r;
          return(r) 
    }
    c0.regis_$bin_handle$(bhandle);				

    //on iclient:
    await ctrl.sess_.conn_.absend(v8.serialize(new Map([[[100],{x:'y'}],[{},[10,20]]])))

    //on eclient
    > length: 34
    > mp
    Map(2) { [ 100 ] => { x: 'y' }, {} => [ 10, 20 ] }
    >





### nv\_sess\_hreq\_verify\_help

- a shape-template of the extracted-incoming-request before Upgrade AND Connection
- for write verify-function  using

####

        {
          cookies: [],
          host: '',
          key: '',
          origin: '',
          remoteAddress: undefined,
          remoteAddresses: [ undefined ],
          requestedExtensions: [],
          requestedProtocols: null,
          resource: '/',
          resourceURL: {
            protocol: null,
            slashes: null,
            auth: null,
            host: null,
            port: null,
            hostname: null,
            hash: null,
            search: null,
            query: {},
            pathname: '/',
            path: '/',
            href: '/'
          },
          webSocketVersion: 13,
          httpRequest: {
            remoteAddress: undefined,
            remotePort: undefined,
            host: 'localhost',
            hostname: 'localhost',
            port: null,
            method: 'GET',
            path: '/',
            headers: {
              upgrade: 'websocket',
              connection: 'Upgrade',
              'sec-websocket-version': '13',
              'sec-websocket-key': '7Ps6/Zdaao8BdULnTnfpmg==',
              host: 'localhost'
            },
            body: Buffer(0) [Uint8Array] []
          }
        }




CPU AND MEM
============

            //on a very poor CPU , 12+years old machine 

            root@dev:/opt/JS/nvsess/sess-isrv# cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l
            1
            root@dev:/opt/JS/nvsess/sess-isrv# cat /proc/cpuinfo| grep "cpu cores"| uniq
            cpu cores       : 2
            root@dev:/opt/JS/nvsess/sess-isrv# cat /proc/cpuinfo| grep "processor"| wc -l
            2
            root@dev:/opt/JS/nvsess/sess-isrv# cat /proc/cpuinfo | egrep MHz
            cpu MHz         : 989.825
            cpu MHz         : 1035.497
            root@dev:/opt/JS/nvsess/sess-isrv# free
                          total        used        free      shared  buff/cache   available
            Mem:        7948576      962440      408892        3216     6577244     6683828
            Swap:       4194300       25856     4168444
            root@dev:/opt/JS/nvsess/sess-isrv#


             //for 5000-6000  sessions 
             //    10 seconds keepalive interval
             //    and small-data (<1k) forwarding at 20 seconds frequency 

             2470394 root      20   0  844812 267576  33220 S  40.7   3.4  31:32.05 node
             2469492 www-data  20   0  184656 136512   6136 S   9.9   1.7   9:07.61 nginx


             //for 10000 sessions, make CPU at 100%, AND observe for 10 hours:
             //    10 seconds keepalive interval
             //    and small-data (<1k) forwarding at 10 seconds frequency

             root@dev:/opt/JS/nvsess/sess-isrv# ./count-detail.sh
             from-chrome-and-edge                  //each 255   
                   510
             from-andriods-and-android-simulators  //org.java_websocket.client.WebsocketClient  + android.app.NotificationChannel/andriodx.core.app.NotificationCompat
                   4000
             from-nodejs-external-clients
                   6000
             from-nodejs-local-clients      
                   9


                    79961 root      20   0 1314736 742920  34172 R 102.5   9.3   1047:58 node
                    780 www-data  20   0  464052 415660   6644 R  32.3   5.2 639:54.96 nginx
                    781 www-data  20   0  246564 199184   6644 R  10.6   2.5 320:57.50 nginx



![image]()

METHODS
=======

### server

        srv.bin_handle_                        srv.cfg_
        srv.close                              
        srv.creq_handle_                       srv.disable_forward
        srv.enable_forward                     srv.fst_sess
        srv.get_sess                           srv.get_sess_with_conn
        srv.get_sess_with_port                 srv.hsrv_
        srv.hsrv_handle_                       srv.jbroadcast_ignore_reply
        srv.jbroadcast_until_all_client_reply  srv.jbroadcast_until_any_client_reply
        srv.json_handle_                       srv.lst_sess
        srv.on_close_                          srv.port_
        srv.regis_$bin_handle$                 srv.regis_$creq_handle$
        srv.regis_$hsrv_handle$                srv.regis_$json_handle$
        srv.regis_$on_close$                   srv.regis_$str_handle$
        
        srv.regis_$verify$                          //for verify raw-http-req before  Upgrade                  
        srv.regis_$after_extract_async_verify$      //for verify extracted-http-req before  Upgrade
        
        srv.restart
        srv.rgx_sess_filter                    srv.sec_websocket_protocol_
        srv.sess_filter                        srv.sesses_
        srv.start                              srv.str_handle_
        srv.verify_                            srv.wsrv_


### client OR browser

        c0.bin_handle_                          c0.cfg_
        c0.check_network_before_reconn_         c0.close
        c0.json_handle_
        c0.on_close_                            c0.on_error_
        c0.regis_$bin_handle$                   c0.regis_$check_network_before_reconn$
        c0.regis_$json_handle$                  c0.regis_$on_close$
        c0.regis_$on_error$                     c0.regis_$sreq_handle$
        c0.regis_$str_handle$                   c0.restart
        c0.sec_websocket_protocol_              c0.sess_
        c0.sreq_handle_                         c0.start
        c0.str_handle_                          c0.url_
        c0.wsrv_


### Sess

#### on server
    

     sess.clear_katsk    sess.katsk_    // keepalive task        
     sess.conn_                 
     sess.id_                   
     sess.req_    
     sess.is_active              
     sess.sjrr_queue_

        /*
        > sess = srv.fst_sess()
        Sess [{
          "id": "wxB98Xgdt-TQCF89Ly-06UNE89Y_Nfa5Dfhug_ZHC_hs6EPMsJJUfp4bjLzkwW1D",
          "host": "192.168.1.103:18888",
          "key": "P+xopEENF66khl+W4aPnCQ==",
          "origin": "chrome://new-tab-page",
          "cookies": [],
          "requestedExtensions": [
            {
              "name": "permessage-deflate",
              "params": [
                {
                  "name": "client_max_window_bits"
                }
              ]
            }
          ],
          "query": {},
          "conn": {
            "address": "::ffff:192.168.1.201",
            "family": "IPv6",
            "port": 60614
          }
        }] {}
        */


#### on client 

       c.sess_.cjrr_queue_           
       c.sess_.clear                 c.sess_.clear_katsk           c.sess_.conn_                 c.sess_.constructor           c.sess_.id_                   c.sess_.is_active
       c.sess_.katsk_                c.sess_.res_

       c.sess_.is_active  

        /*
        > c.sess_
        Sess [{
          "id": "5pru0IEXorUmz2AjDRGG7NbWdY5kxrJ__HGo3ahtstFYWMj8ArkNdJ6f3j_c3rAp",
          "local": {
            "localAddress": "192.168.1.103",
            "localPort": 49810
          }
        }] {}
        */


#### on browser

     var sess = bw.sess_ 
     sess.clear_katsk    sess.katsk_    // keepalive task
     sess.conn_
     sess.id_
     sess.res_
     sess.is_active
     sess.cjrr_queue_
     sess.is_active





### Conn

##### on server

        sess.conn_.absend
        sess.conn_.ajsend
        sess.conn_.asend_ping_frame
        sess.conn_.assend

        sess.conn_.bsend
        sess.conn_.ssend
        sess.conn_.jsend

        sess.conn_.close
        sess.conn_.send_jrr_sreq
        sess.conn_.send_jrr_sres
        sess.conn_.send_ping_frame



        sess.conn_.config
        sess.conn_.is_client_
        sess.conn_.is_server_
        sess.conn_.ka_
        sess.conn_.protocol
        sess.conn_.sess_
        sess.conn_.state

##### on client

        c.sess_.conn_.absend
        c.sess_.conn_.ajsend
        c.sess_.conn_.asend_ping_frame
        c.sess_.conn_.assend

        c.sess_.conn_.bsend
        c.sess_.conn_.ssend
        c.sess_.conn_.jsend

        c.sess_.conn_.close
        c.sess_.conn_.send_jrr_creq
        c.sess_.conn_.send_jrr_cres
        c.sess_.conn_.send_ping_frame



        c.sess_.conn_.config
        c.sess_.conn_.is_client_
        c.sess_.conn_.is_server_
        c.sess_.conn_.ka_
        c.sess_.conn_.protocol
        c.sess_.conn_.sess_
        c.sess_.conn_.state


#####  on browser



        c.sess_.conn_.absend
        c.sess_.conn_.bsend
        
        c.sess_.conn_.ssend
        c.sess_.conn_.jsend
        c.sess_.conn_.close
        c.sess_.conn_.send_jrr_creq
        c.sess_.conn_.send_jrr_cres


        c.sess_.conn_.config
        c.sess_.conn_.is_client_
        c.sess_.conn_.is_server_
        c.sess_.conn_.ka_
        c.sess_.conn_.protocol
        c.sess_.conn_.sess_
        c.sess_.conn_.state




API
====

### Server

         Server.VALI_HREQ_TEM;
         Server.extract_hreq;
         //FOR:
             srv.regis_$verify$((hreq)=>true)                               AND
             sev.regis_$after_extract_async_verify$(async (hreq)=>true)
           USING    

### Client


### Browser

     ['DFLT_CFG', 'ERROR', 'CLOSE_ERRORS', 'DFLT_BIN_HANDLE', 'DFLT_STR_HANDLE', 'DFLT_JSON_HANDLE', 'DFLT_SREQ_HANDLE', 'DFLT_ON_CLOSE', 'DFLT_ON_ERROR', 'DFLT_CHECK_NETWORK_BEFORE_RECONN', 'to_u8ary', 'ato_u8ary']


LICENSE
=======
- ISC 
