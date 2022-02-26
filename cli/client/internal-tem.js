
const path = require("path");

function fmt_usock(usock) {
    if(usock === undefined) {
        usock = path.join(process.cwd(),'___usock___')
    } else {}
    return(usock)
}


const HANDLE_CODE = `
//---your binary handler
c.regis_\$bin_handle\$(
    async (length,data,conn,sess,self) => {
        //console.log({length,data})
        //    data is Buffer
        //conn.bsend(buf:Buffer)
        // OR
        //await conn.absend(buf:Buffer)
    }
);


//---your string handler
c.regis_\$str_handle\$(
    async (s,conn,sess,self) => {
        //console.log('received string',s)
        //    s is string
        //conn.ssend(str:String)
        //  OR
        //await conn.assend(str:String)
    }
);


//----your json handler
c.regis_\$json_handle\$(
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

`;



function creat_usock_tem(is_ssl,usock,protocols) {
    usock = fmt_usock(usock);
    protocols = (protocols===undefined)?'undefined':`"${protocols}"`;
    let url = `ws+unix://${usock}`; 

    let tem = `
module.exports = async () => {
     const {Client} = require("nv-session-simple").client;
     const  c = new Client();
////<-----
${HANDLE_CODE}
////----->
     await c.start("${url}",${protocols});
     return(c)
}
`
    return(tem)
}




function creat_port_tem(is_ssl,port,protocols) {
    let scheme = is_ssl?'wss':'ws';
    port = (port===undefined || port === '')?'':`:${Number(port)}`;
    protocols = (protocols===undefined)?'undefined':`"${protocols}"`;
    let url = `${scheme}://127.0.0.1${port}`;
    let tem = `
module.exports = async () => {
     const {Client} = require("nv-session-simple").client;
     const  c = new Client();
////<-----
${HANDLE_CODE}
////----->
     await c.start("${url}",${protocols});
     return(c)
}
`
    return(tem)
}





const DFLT_CFG = ()=> ({
    ////
    sec_websocket_protocol: undefined,
    //////
    internal_is_usock:true,
    internal_usock:undefined,  //IF undefined : ./___usock___
    //////
    internal_ssl:false,
    internal_port:65512,      //USELESS when USING usock
})

module.exports = {
    DFLT_CFG,
    creat_usock_tem,
    creat_port_tem,
}


