
const path = require("path");


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



function creat_tem(fname,is_ssl,ip,port,route,protocols) {
    let scheme = is_ssl?'wss':'ws';
    port = (port===undefined || port === '')?'':`:${Number(port)}`;
    route = (route===undefined )?'/':route;
    ////
    protocols = (protocols===undefined)?'undefined':`"${protocols}"`;
    let url = `${scheme}://${ip}${port}${route}`;
    let tem = `
async function ${fname} () {
     const  c = new Bwsess();
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
    creat_func_name:'bwsess_connect',
    ////
    sec_websocket_protocol: undefined,
    //////
    external_ssl:true,
    external_ip:'192.168.1.103',
    external_port:65512,      //USELESS when USING usock
    external_route:'/',
})

module.exports = {
    DFLT_CFG,
    creat_tem,
}


