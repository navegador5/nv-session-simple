
const path = require("path");

function fmt_usock(usock) {
    if(usock === undefined) {
        usock = path.join(process.cwd(),'___usock___')
    } else {}
    return(usock)
}


function creat_usock_srv_head_code(usock,nginx_user) {
    let tem = `
const fs = require('fs');
const chown_with_name = require("nv-cli-user").chown_with_name;
try {fs.unlinkSync("${usock}")} catch(err) {};
const {Server} = require("nv-session-simple").srv;
const srv = new Server();
`
    return(tem)  
}


const HANDLE_CODE = `
//---your binary handler
srv.regis_\$bin_handle\$(
    async (length,data,conn,sess,self) => {
        //console.log({length,data})
        //    data is Buffer
        //conn.bsend(buf:Buffer)
        // OR
        //await conn.absend(buf:Buffer)
    }
);


//---your string handler
srv.regis_\$str_handle\$(
    async (s,conn,sess,self) => {
        //console.log('received string',s)
        //    s is string
        //conn.ssend(str:String)
        //  OR
        //await conn.assend(str:String)
    }
);


//----your json handler
srv.regis_\$json_handle\$(
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

`;



function creat_non_forward_usock_tem(usock,nginx_user='www-data',protocols) {
    usock = fmt_usock(usock);
    protocols = (protocols===undefined)?'undefined':`"${protocols}"`
    let tem = `
${creat_usock_srv_head_code(usock,nginx_user)}
    
${HANDLE_CODE}

module.exports = async () => {
     await srv.start("${usock}",${protocols});
     chown_with_name("${usock}","${nginx_user}");
     return(srv)
}
`
    return(tem)
}


function creat_forward_usock_tem(usock,nginx_user='www-data',protocols) {
    usock = fmt_usock(usock);
    protocols = (protocols===undefined)?'undefined':`"${protocols}"`
    let tem = `
${creat_usock_srv_head_code(usock,nginx_user)}

srv.enable_forward();    
    
//----your creq_handle@optional
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
     await srv.start("${usock}",${protocols});
     chown_with_name("${usock}","${nginx_user}");
     return(srv)
}
`
    return(tem)
}





function creat_non_forward_port_tem(port,protocols,scheme,opts) {
    opts = (port===undefined || port==='')?{}:opts;
    port = (port===undefined)?'undefined':`${Number(port)}`;
    protocols = (protocols===undefined)?'undefined':`"${protocols}"`;
    opts = JSON.stringify(opts)
    let tem = `
const {Server} = require("nv-session-simple").srv;
const srv = new Server();

${HANDLE_CODE}

module.exports = async () => {
    await srv.start(${port},${protocols},${scheme},JSON.parse(${opts}));
    return(srv)
}
`
    return(tem)
}


function creat_forward_port_tem(port,protocols,scheme) {
    opts = (port===undefined || port==='')?{}:opts;
    port = (port===undefined)?'undefined':`${Number(port)}`;
    protocols = (protocols===undefined)?'undefined':`"${protocols}"`;
    opts = JSON.stringify(opts);
    let tem = `
const {Server} = require("nv-session-simple").srv;
const srv = new Server();

srv.enable_forward();

//----your creq_handle@optional
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
     await srv.start(${port},${protocols},${scheme},JSON.parse(${opts}));
     return(srv)
}
`
    return(tem)
}





const DFLT_CFG = ()=> ({
    ////
    sec_websocket_protocol: undefined,
    forward:false,                     //  server is for forwarding, default false
    //////
    internal_is_usock:true,
    internal_usock:undefined,  //IF undefined : ./___usock___
    nginx_user:'www-data',     //chown usock to nginx  USELESS when USING  ip:port@optional
    //////
    internal_ssl:false,
    internal_ssl_cert:path.join(__dirname,'../../srv/cert/https-tst.cert'),
    internal_ssl_key:path.join(__dirname,'../../srv/cert/https-tst.key'),
    internal_port:65512,      //USELESS when USING usock
})

module.exports = {
    DFLT_CFG,
    creat_non_forward_usock_tem,
    creat_forward_usock_tem,
    creat_non_forward_port_tem,
    creat_forward_port_tem,
}


