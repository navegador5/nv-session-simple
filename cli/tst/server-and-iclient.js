module.exports =`
const srv = await require("./srv")();
const ctrl = await require("./iclient")();

/*
var jhandle = async function(j,conn,sess,self) {
     console.dir(j,{depth:null})
}

//wait all eclient-connections AND browser-connections finished
ctrl.regis_$json_handle$(jhandle);
await ctrl.sess_.conn_.ajsend({action:'do NOT reboot!'})

    
*/

`
