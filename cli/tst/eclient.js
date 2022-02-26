module.exports =`
async function tst(count=2000) {
         const wait = (delay)=> {
             let p = new Promise(
                 (rs,rj)=> {
                     setTimeout(
                         ()=> {rs()},
                         delay
                     )
                 }
             );
             return(p)
         }
         for(let i=0;i<count;i++) {
             let name = 'c' + i;
             global[name] = await require("./eclient")();
             let c = global[name];
             await wait(20);          //
         }

}

function regis_jhandle(count=2000) {
         var jhandle = async function(j,conn,sess,self) {
             if(j.___type___!== '___cfg___') {
                 console.dir(j,{depth:null})
             } else {}
         }
         for(let i=0;i<count;i++) {
             let name = 'c'+i;
             let c = global[name];
             c.regis_$json_handle$(jhandle);
         }
}


//await tst(4000)
//regis_jhandle(4000)

`;
