module.exports =`
function tst(count=2000) {
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
                 let name = 'c' + i;
                 global[name] = await require("./eclient")();
                 let c = global[name];
                 await wait(20);          //
             }
             for(let i=0;i<count;i++) {
                 let name = 'c' + i;
                 let c = global[name];
                 c.regis_$json_handle$(jhandle);
             }
         })();

}
`;
