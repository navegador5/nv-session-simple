const {Server} = require("nv-session-simple").srv;
const {Client} = require("nv-session-simple").client;

var srv = new Server()
fs.unlinkSync("___usock___");
await srv.start("___usock___");


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

const {Server} = require("nv-session-simple").srv;
const {Client} = require("nv-session-simple").client;





var srv = new Server()
await srv.start(8888,undefined,'https');
srv.enable_forward()

var c3 = new Client();
c3.regis_$json_handle$(
    async (recved_json,conn,sess,self) => {
        console.log('client0 Received JSON Message of ',recved_json);
    }
);
await c3.start(`wss://127.0.0.1:8888/a/b`)


//----------------------------
//-------------------------

var srv = new Server()
await srv.start(8888,undefined);
srv.enable_forward()

var c5 = new Client();
c5.regis_$json_handle$(
    async (recved_json,conn,sess,self) => {
        console.log('client0 Received JSON Message of ',recved_json);
    }
);
await c5.start(`ws://127.0.0.1:8888/a/b`)

