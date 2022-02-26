const {Server} = require("nv-session-simple").srv;
const {Client} = require("nv-session-simple").client;

var srv = new Server()

fs.unlinkSync("___usock___");
await srv.start("___usock___");
srv.enable_forward()

/*
srv.regis_$json_handle$(
    async (recved_json,conn,sess,self) => {
        console.log('Received JSON Message of ',recved_json);
        //conn.jsend(...J....);
        //  OR
        //await conn.ajsend(...J...)
    }
)
*/

var c0 = new Client();
c0.regis_$json_handle$(
    async (recved_json,conn,sess,self) => {
        console.log('client0 Received JSON Message of ',recved_json);
    }
);


await c0.start(`ws+unix://${process.cwd()}/___usock___`)


var c1 = new Client();
c1.regis_$json_handle$(
    async (recved_json,conn,sess,self) => {
        console.log('client1 Received JSON Message of ',recved_json);
    }
);
await c1.start(`ws+unix://${process.cwd()}/___usock___`)


var c2 = new Client();
c2.regis_$json_handle$(
    async (recved_json,conn,sess,self) => {
        console.log('client2 Received JSON Message of ',recved_json);
    }
);
await c2.start(`ws+unix://${process.cwd()}/___usock___`)

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


