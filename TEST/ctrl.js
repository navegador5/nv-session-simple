const v8 = require("v8");
const {wait} = require("nv-facutil-promise");


(async function() {
        global.ctrl = await require("./iclient")();
        ctrl.list_sesses  = async()=> {
            let res = await ctrl.sess_.conn_.send_jrr_creq({password:'ctrl'});
            let data = res.___data___;
            let serials = data.count;
            return(serials)
        }
        ctrl.sendj = async(J={from:'ctrl'})=> { await ctrl.sess_.conn_.ajsend(J)}

        async function random_msg() {
            while(true) {
                  //await ctrl.sendj({random:Math.floor(Math.random()*100000)})
                  await ctrl.sendj({code:1,data:["hello"]});
                  await wait(5000+Math.random()*10000);
            }
        }
        random_msg()
})();

//var jhandle = async function(j,conn,sess,self) {console.dir(j,{depth:null})}
//wait all eclient-connections AND browser-connections finished
//ctrl.regis_jh = ()=> ctrl.regis_$json_handle$(jhandle);

