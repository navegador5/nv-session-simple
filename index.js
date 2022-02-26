const srv    = require("./srv/srv");
const vali   = require("./srv/srv-vali");
const cfg    = require("./srv/srv-cfg");
const jmsg   = require("./jmsg");
const frame  = require("./frame");
const client = require("./client/client");


module.exports = {
   srv,
   DFLT_SRV_CFG:require("./srv/srv-cfg").DFLT_CFG(),
   Server:srv.Server,
   ////
   client,
   DFLT_CLIENT_CFG:require("./client/client-cfg").DFLT_CFG(), 
   Client:client.Client,
   ////
   jmsg,
   frame,  
   ////
   vali,
   /////
}

