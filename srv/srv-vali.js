
const {extract_req} = require("nv-server-simple-stream").basic_util;


const VALI_HREQ_TEM = ()=>({
        cookies:[]  ,                                             
        host: '' ,                  
        key : ''  ,                        
        origin : '',
        remoteAddress :   undefined,               
        remoteAddresses : [undefined],
        requestedExtensions : [],            
        requestedProtocols  :null,            
        resource:'/',
        resourceURL : {
          protocol: null,
          slashes: null,
          auth: null,
          host: null,
          port: null,
          hostname: null,
          hash: null,
          search: null,
          query:  {},
          pathname: '/',
          path: '/',
          href: '/'
        },                                     
        webSocketVersion:13,
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
             body: Buffer.from('')
		}
})


async function extract_hreq(R) {
    let D = VALI_HREQ_TEM();
	for(let k in D) {
	    D[k] = R[k]
	}
	let H = R.httpRequest;
	D.httpRequest = await extract_req(H);
	return(D)
}


function creat_head_utoken_vali(utoken,k='nv-utoken') {
     let _f = async function(R) {
         let D = await extract_hreq(R);
         let httpRequest = D.httpRequest;
         return(httpRequest.headers[k]===String(utoken))
     }
     return(_f)
}

function creat_head_utoken_and_action_vali(utoken,action,uk='nv-utoken',ak='nv-action') {
     let _f = async function(R) {
         let D = await extract_hreq(R);
         let httpRequest = D.httpRequest;
         return(
             httpRequest.headers[uk]===String(utoken) &&
             httpRequest.headers[ak]===String(action)
         )
     }
     return(_f)
}


/*
function creat_utoken_and_action_vali(utoken,action) {
      let _f = function(req,conn,id) {
	   return(
	      req.query.utoken===utoken &&
              req.query.action === action		   
	   )   
      }
      return(_f)	
}
*/

module.exports = {
    VALI_HREQ_TEM,
    extract_hreq,
    ////
    creat_head_utoken_vali,
    creat_head_utoken_and_action_vali,
}
