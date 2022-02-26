module.exports=`
function tst(count=255) {
         var jhandle = async function(j,conn,sess,self) {
             console.dir(j,{depth:null})
         }
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
         (async function () {
             for(let i=0;i<count;i++) {
                 let name = 'c'+i;
                 window[name] = await bwsess_connect();
                 let c = window[name];
                 await wait(25)
             }
             for(let i=0;i<count;i++) {
                 let name = 'c'+i;
                 let c = window[name];
                 c.regis_$json_handle$(jhandle);
             }
         })();

}
`;
