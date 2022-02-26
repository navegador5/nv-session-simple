   const {Server} = require("../index")
   var srv = new Server()
   srv.cfg_.keepaliveInterval=60000
   await srv.start(65512)
   srv.wsrv_.connections[0].send_jrr_sreq([1,2,3])

