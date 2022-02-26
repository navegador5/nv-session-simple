module.exports=`
async function tst(count=255) {
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
         ////
         for(let i=0;i<count;i++) {
             let name = 'c'+i;
             window[name] = await bwsess_connect();
             let c = window[name];
             await wait(25)
         }
}

function regis_jhandle(count=255) {
         var jhandle = async function(j,conn,sess,self) {
             if(j.___type___!== '___cfg___') {
                 console.dir(j,{depth:null})
             } else {}
         }
         for(let i=0;i<count;i++) {
             let name = 'c'+i;
             let c = window[name];
             c.regis_$json_handle$(jhandle);
         }
}

// await tst(255)
// regis_jhandle()
`;
