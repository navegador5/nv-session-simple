var Bwsess=(()=>{var ue=Object.defineProperty;var Je=e=>ue(e,"__esModule",{value:!0});var fe=(e,t)=>()=>(e&&(t=e(e=0)),t);var x=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),$e=(e,t)=>{Je(e);for(var n in t)ue(e,n,{get:t[n],enumerable:!0})};var de,he=fe(()=>{de="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"});var Y={};$e(Y,{customAlphabet:()=>Pe,customRandom:()=>pe,nanoid:()=>Ue,random:()=>ge,urlAlphabet:()=>de});var ge,pe,Pe,Ue,Q=fe(()=>{he();ge=e=>crypto.getRandomValues(new Uint8Array(e)),pe=(e,t,n)=>{let a=(2<<Math.log(e.length-1)/Math.LN2)-1,f=-~(1.6*a*t/e.length);return()=>{let m="";for(;;){let O=n(f),L=f;for(;L--;)if(m+=e[O[L]&a]||"",m.length===t)return m}}},Pe=(e,t)=>pe(e,t,ge),Ue=(e=21)=>{let t="",n=crypto.getRandomValues(new Uint8Array(e));for(;e--;){let a=n[e]&63;a<36?t+=a.toString(36):a<62?t+=(a-26).toString(36).toUpperCase():a<63?t+="_":t+="-"}return t}});var me=x((wt,ye)=>{var He=e=>typeof e=="string",Ge=e=>e instanceof RegExp;ye.exports={is_str:He,is_regex:Ge}});var V=x((kt,ve)=>{var Be=(()=>{var e,t;return(e=(n,a)=>{var f=Object.defineProperty,m=Symbol("tmout"),O=Symbol("too_early"),L=2**31-2;function h(r,s,i,..._){let o=[];var c;return i===0?(c=setTimeout(s,0,..._),o.push(c)):(c=i%r,function g(y,d,l,N,k,...u){var E;l===0?k===0?N(...u):(E=setTimeout(N,k,...u),y.push(E)):(E=setTimeout(()=>{g(y,d,l-1,N,k,...u)},d),y.push(E))}(o,r,(i-c)/r,s,c,..._)),o}function C(r,s,...i){return h(L,r,s,...i)}function A(r){r.forEach(s=>clearTimeout(s))}function v(r){r.p.clear(),r.cancel=!0}var $=class{constructor(){this.p={clear:()=>{}},this.cancel=!1}};async function D(r,s,i,_,...o){var c;for await(c of async function*(g,y,d,...l){let N=(d=d instanceof Array?d:[d]).length,k=0;for(;!g.cancel;){var u=w(d[k%N]);if(await(g.p=u),g.cancel)break;yield await y(...l),k+=1}}(r,i,_,...o))s!==void 0&&s.push(c)}function p(){let r,s;return[new Promise((i,_)=>{r=i,s=_}),r,s]}function b(r,s,i){let[_,o,c]=p(),g=r===0?o:c,y=C((d,l)=>{g(i)},s,o,c);return _.clear=()=>{A(y),o()},_}function w(r){return b(0,r,!0)}function j(r,s,...i){let[_,,o]=p();return C(()=>{o(r)},s,...i),_}function M(r,s,i,..._){let[o,c,g]=p(),y=r?c:g;return C(()=>{y(s)},i,..._),o}function ae(r,s,...i){return r=j(m,r),i=s(...i),Promise.race([r,i])}M.ACT={rs:1,rj:0};var H=class extends Error{json(){return{name:this.name,message:parseFloat(this.message),stack:this.stack}}};function ce(r,s,i=!1,_=m,o){if(s===void 0)return r;var c=new Promise((g,y)=>{let d=C(()=>{A(d),d.forEach(l=>null),i?g(_):(o??new H(s),y(o))},s)});return r=Promise.race([r,c])}function W(r,s=!1,i=m,_){var[,o,c]=p();return[ce(r,s,i,_),o,c]}function F(){return new Date().getTime()}var le=class extends Array{pusht(){var r=F();if(this.length===0)this.push([r,null]);else{let s=this[this.length-1];s[0]===null?s[0]=r:s[1]===null?s[1]=r:this.push([r,null])}}get lst_(){return this[this.length-1]}get passed_(){let r=0;for(var s of this){if(s[1]===null){r=r+F()-s[0];break}r=r+s[1]-s[0]}return r}clear(){return this.splice(0,this.length),this}reset(){this.clear(),this.pusht()}};function P(r,s,i){i=i??r;let _=C(()=>{s(new H(i))},r);return _.clear=()=>A(_),_}a.exports={USAGE:()=>console.log(`
const {
    _psj,wait,ka,
    delay_rsv,delay_rjv,
    newSetTimeout,newClearTimeout,
    tmoutp,
    creat_random_tmout_settle,creat_set_tmout_at,
    rplc_rslt,rplc_err,
    now
} = bwprom`),TMOUT:m,TOO_EARLY:O,creat_setmout_resolve:function(r,s,...i){let[_,o]=p();return C(()=>{o(r)},s,...i),_},creat_setmout_reject:j,creat_setmout_settle:M,creat_set_tmout_at:function(r,s,...i){var _=(r=r instanceof Date?r:new Date(r)).getTime(),r=new Date().getTime();return _<r?Promise.reject("must-ge-now"):ae(_-r,s,...i)},creat_tmout_promise:ae,creat_random_tmout_settle:function(r,s,...i){return M(Math.floor(2*Math.random()),r,s,...i)},MAX_NODEJS_TMOUT:L,_newSetTimeout:h,newSetTimeout:C,newClearTimeout:A,_psj:p,wait:w,delay_rsv:function(r,s){return b(0,r,s)},delay_rjv:function(r,s){return b(1,r,s)},tmoutp:ce,psj:W,psj_tm_between:function(r,s,i=O,_=m,o=!1,c){let[g,y,d]=W(s,o,c,_),l;if(r!==void 0){let k=F();l=u=>{F()-k>=r?y(u):(o?y:d)(i)}}else l=y;let N;if(r!==void 0){let k=F();N=u=>{F()-k>=r?d(u):(o?y:d)(i)}}else N=d;return[g,l,N]},TmoutError:H,TimeRangeCache:le,ka:function(r,s=_=>{},i=_=>{}){let _,o=new le;o.pusht();let c=!1,g=!1,y=!1,d=!1,[l,N,k]=W();return l.then(u=>{i(u)}).catch(u=>{o.pusht(),c=!0,_!==void 0&&_.clear(),s(u)}),_=P(r,k),l.immediate=()=>{if(g||c)return!1;d=d&&!1,_.clear(),k(new H(l.passed_))},l.cancel=()=>!!g||!c&&(g=!0,d?d=!1:o.pusht(),_!==void 0&&_.clear(),void N("canceled")),l.pause=()=>!!d||!g&&!c&&(o.pusht(),_.clear(),void(d=!0)),l.continue=()=>{if(!d)return!1;o.pusht();var u=l.lefted_;_=P(u,k,r),d=!1},l.renew=(u=!0)=>!(g||c||y)&&(_.clear(),o.reset(),_=P(r,k),d&&(d=!1,u||l.pause()),!0),l.never=()=>!g&&!c&&(y||(_.clear(),y=!0),!0),l.postpone=u=>{if(g||c)return!1;if(y)return!0;var E=l.lefted_;return _.clear(),_=P(E+u,k,r+u),r+=u,d&&(d=!1,this.pause()),!0},l.ahead=u=>{if(diff=-u,g||c||y)return!1;var E=l.passed_;return r-u-E<=0?l.immediate():(E=l.passed_,_.clear(),_=P(r-u-E,k,r-u),r-=u,d&&(d=!1,this.pause()),!0)},l.change=(u,E=!1)=>{if(u=E?r+u:u,g||c)return!1;if(y)return u===1/0||(y=!1,r=u,_=P(r,k),d&&(d=!1,this.pause())),!0;if(u<r){var K=l.ahead(r-u);return r=u,K}return u===r?!0:(K=l.postpone(u-r),r=u,K)},l.is_tmouted=()=>c,l.is_nevered=()=>y,l.is_canceled=()=>g,l.is_paused=()=>d,f(l,"tmout_",{get:()=>r}),f(l,"cache_",{get:()=>o}),f(l,"passed_",{get:()=>o.passed_}),f(l,"lefted_",{get:()=>g||c?-1:y?1/0:r-o.passed_}),l},set_interval:function(r,s,...i){let _=[],o=new $;return D(o,_,r,s,...i),{rslts:_,newClearInterval:()=>v(o)}},set_interval_without_rslts:function(r,s,...i){let _=new $;return D(_,void 0,r,s,...i),{newClearInterval:()=>v(_)}},rplc:function(r,s,i){let[_,o,c]=p();return r.then(g=>{o(s)}).catch(g=>{c(i)}),_},rplc_rslt:function(r,s){let[i,_,o]=p();return r.then(c=>{_(s)}).catch(c=>{o(c)}),i},rplc_err:function(r,s){let[i,_,o]=p();return r.then(c=>{_(c)}).catch(c=>{o(s)}),i},now:F}},()=>(t||e((t={exports:{}}).exports,t),t.exports))()})();ve.exports=Be});var X=x((bt,we)=>{var Me=globalThis.WebSocket;we.exports=Me});var be=x((jt,ke)=>{var We={CONNECTING:0,0:"CONNECTING",OPEN:1,1:"OPEN",CLOSING:2,2:"CLOSING",CLOSED:3,3:"CLOSED"},Ke={unknown:3001,3001:"unknown",keepalive:3002,3002:"keepalive"};ke.exports={STATES:We,ERRORS:Ke}});var Se=x((Rt,Re)=>{var{nanoid:Ye}=(Q(),Y),T={cfg:"___cfg___",creq:"___creq___",cres:"___cres___",sreq:"___sreq___",sres:"___sres___",ping:"___ping___",pong:"___pong___"},I=class{constructor(t,n={},a){this.___type___=t,this.___id___=a??Ye(64),this.___data___=n}get type_(){return this.___type___}get id_(){return this.___id___}get data_(){return this.___data___}is_pair(t){return this.___type___===t.___type___&&this.___req___===t.___req___}};function Qe(e){try{let t=JSON.parse(e);return[t instanceof Object,t]}catch(t){return[!1,e]}}function Ve(e){return e.___type___===T.creq}function Xe(e){return e.___type___===T.cres}function Ze(e){return e.___type___===T.sreq}function ze(e){return e.___type___===T.sres}function et(e){return e.___type___===T.cfg}function tt(e){return e.___type___===T.ping}function rt(e){return e.___type___===T.pong}function nt(e){let t=JSON.stringify(e),n=new I(T.ping,t);return JSON.stringify(n)}function st(e){let t=JSON.stringify(e),n=new I(T.pong,t);return JSON.stringify(n)}var q=X(),{_psj:G}=V();function Z(e){return e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):e instanceof Array?new Uint8Array(e):typeof e=="string"?new Uint8Array(Array.from(e)):new Uint8Array(e)}async function je(e){if(e instanceof Blob){let t=await e.arrayBuffer();return new Uint8Array(t)}else return Z(e)}q.prototype.bsend=function(e){this.send(Z(e))};q.prototype.ssend=function(e){this.send(String(e))};q.prototype.jsend=function(e){let t=JSON.stringify(e);this.send(t)};q.prototype.assend=function(e){console.log("useless on browser,same as ssend"),this.send(String(e))};q.prototype.absend=async function(e){e=await je(e),this.send(e)};q.prototype.ajsend=function(e){console.log("useless on browser,same as jsend");let t=JSON.stringify(e);this.send(t)};var U={cant_use_sreq_from_client:"cant_use_sreq_from_client",cant_use_cres_from_server:"cant_use_cres_from_server",cant_use_creq_from_server:"cant_use_creq_from_server",cant_use_sres_from_client:"cant_use_sres_from_client"};q.prototype.send_jrr_sreq=function(e){if(this.is_server_){let t=new I(T.sreq,e),[n,a,f]=G(),m=this.sess_;return m.sjrr_queue_[t.___id___]={rs:a,rj:f},this.send(JSON.stringify(t)),n}else console.log(U.cant_use_sreq_from_client)};q.prototype.send_jrr_cres=function(e,t){if(this.is_client_){let n=new I(T.cres,e,t),[a,f,m]=G();return this.send(JSON.stringify(n),O=>{f(O)}),a}else console.log(U.cant_use_cres_from_server)};q.prototype.send_jrr_creq=function(e){if(this.is_client_){let t=new I(T.creq,e),[n,a,f]=G(),m=this.sess_;return m.cjrr_queue_[t.___id___]={rs:a,rj:f},this.send(JSON.stringify(t)),n}else console.log(U.cant_use_creq_from_server)};q.prototype.send_jrr_sres=function(e,t){if(this.is_server_){let n=new I(T.sres,e,t),[a,f,m]=G();return this.send(JSON.stringify(n),O=>{f(O)}),a}else console.log(U.cant_use_sres_from_client)};Re.exports={MSG_TYPE:T,Msg:I,creat_send_ping_msg:nt,creat_send_pong_msg:st,is_jmsg:Qe,is_ping_msg:tt,is_pong_msg:rt,is_cfg_msg:et,is_jrr_creq_msg:Ve,is_jrr_sres_msg:ze,is_jrr_sreq_msg:Ze,is_jrr_cres_msg:Xe,to_u8ary:Z,ato_u8ary:je,ERROR:U}});var Ee=x((St,Te)=>{var _t=()=>({autoReconnect:!0,autoReconnectInterval:6e4,keepalive:!0,keepaliveInterval:2e4});Te.exports={DFLT_CFG:_t}});var pt=x((Ot,xe)=>{var{nanoid:it}=(Q(),Y),{is_str:Tt,is_regex:Et}=me(),{_psj:ot,ka:at,wait:ct}=V(),lt=X(),{STATES:Oe,ERRORS:z}=be(),R=Se(),{DFLT_CFG:ee}=Ee();function te(e,t,n){return e?(e.close(t,n),Promise.resolve([t,n])):Promise.resolve([void 0,void 0])}var Ne=Symbol(""),De=class{#t;#e;#r;#n={};#s=void 0;constructor(t,n){this.#t=t,this.#e=n,this.#r=it(64)}get katsk_(){return this.#s}set katsk_(t){this.#s=t}clear_katsk(){clearInterval(this.#s),this.#s=void 0,this.#e?.ka_&&this.#e.ka_?.cancel()}get id_(){return this.#r}get res_(){return this.#t}get conn_(){return this.#e}get cjrr_queue_(){return this.#n}[Ne](t){let n=t.___id___,a=this.#n[n];a!==void 0&&(a.rs(t),delete this.#n[n])}is_active(){return this.#e?.readyState===Oe.OPEN}clear(){this.#t=void 0,this.#e=void 0,this.#r=void 0,this.#n={},this.#s=void 0}get[Symbol.toStringTag](){return JSON.stringify({id:this.#r,binaryType:this.#e.binaryType,bufferedAmount:this.#e.bufferedAmount,protocol:this.#e.protocol,state:Oe[this.#e.readyState],url:this.#e.url},null,2)}},qe={only_support_utf8_or_binary_or_json:"only_support_utf8_or_binary_or_json"},re=async(e,t,n,a)=>{},ne=async(e,t,n,a,f)=>{},se=async(e,t,n,a)=>{},_e=async(e,t,n,a)=>{},ie=async(e,t,n,a)=>{},B=(...e)=>!0;function ut(e,t,n){if(e.cfg_.keepalive&&e.cfg_.keepaliveInterval){let a=at(e.cfg_.keepaliveInterval);a.then(f=>{}).catch(f=>{let m=R.creat_send_ping_msg(e.cfg_.keepaliveInterval);m.___data___=f,t.is_active()&&n.send(m),setTimeout(()=>{te(n,z.keepalive,"keepalive").then(L=>{}).catch(L=>{})},0)}),Object.defineProperty(n,"ka_",{get:function(){return a},enumerable:!1})}}function ft(e,t,n){if(e.cfg_.keepalive&&e.cfg_.keepaliveInterval){let a=R.creat_send_ping_msg(e.cfg_.keepaliveInterval),f=setInterval(()=>{t.is_active()&&n.send(a)},e.cfg_.keepaliveInterval/4);t.katsk_=f}}var Le=(e,t,n,a,f)=>{console.log(e,t,n)},Ce=(e,t,n,a,f)=>{console.log(e,t,n)},Ae=Symbol(""),Ie=Symbol(""),J=Symbol(""),oe=Object.defineProperty;function dt(e,t){oe(e,"sess_",{get:function(){return t},enumerable:!1}),oe(e,"is_server_",{get:function(){return!1},enumerable:!1}),oe(e,"is_client_",{get:function(){return!0},enumerable:!1})}function ht(e,t,n){e.cfg_.keepalive===!0&&(ft(e,n,t),ut(e,n,t),n.is_active()&&t.jsend({___type___:"___cfg___",___data___:{sessid:n.id_,keepaliveInterval:e.cfg_.keepaliveInterval}}))}function gt(e){if(e.cfg_.autoReconnect===!0){let t=setInterval(async()=>{if(e.sess_!==void 0){if(!e.sess_.is_active()){if(e[J]!==!0){if(e.check_network_before_reconn_()){console.log("auto-reconn-g");try{await e.restart()}catch(n){}}}}}},e.cfg_.autoReconnectInterval);e[Ie](t)}}async function Fe(e){if(e.cfg_.autoReconnect===!0)if(!e.check_network_before_reconn_())console.log("not-connected");else{console.log("auto-reconn-c");try{await e.restart()}catch(t){}}}var S=class{#t=void 0;#e=ee();#r=void 0;#n=void 0;#s=void 0;#o=Le;#a=Ce;#c=re;#l=ne;#_=se;#h=_e;#u=ie;#f=void 0;#d=!1;#i=B;get[J](){return this.#d}set[J](t){this.#d=t}[Ie](t){this.#f=t}get wsrv_(){return this.#t}get cfg_(){return this.#e}get sess_(){return this.#s}[Ae](t){this.#s=t}constructor(t=ee()){for(let n in t)this.#e[n]=t[n]}get url_(){return this.#r}get sec_websocket_protocol_(){return this.#n}regis_$on_close$(t=(n,a,f)=>{}){this.#o=t}get on_close_(){return this.#o}regis_$on_error$(t=(n,a,f)=>{}){this.#a=t}get on_error_(){return this.#a}regis_$check_network_before_reconn$(t=B,...n){this.#i=()=>{B(...n)}}get check_network_before_reconn_(){return this.#i}regis_$cfg_handle$(t=re){this.#c=t}get cfg_handle_(){return this.#c}regis_$bin_handle$(t=ne){this.#l=t}get bin_handle_(){return this.#l}regis_$json_handle$(t=se){this.#_=t}get json_handle_(){return this.#_}regis_$str_handle$(t=_e){this.#_=t}get str_handle_(){return this.#h}regis_$sreq_handle$(t=ie){this.#u=t}get sreq_handle_(){return this.#u}async start(t,n=void 0){this.#r=t,this.#n=n;try{this.#t=new lt(t,n);let a=this.#t,[f,m,O]=ot();this[J]=!1;let L=this.#i,h=this;return this.#t.onerror=function(A){O(A)},this.#t.onopen=async function(A){let v=a,$=new De(A,v);h[Ae]($),dt(v,$),ht(h,v,$),gt(h),v.onmessage=async function(D){let p=D.data,b=v.sess_;if(h.cfg_.keepalive===!0)try{v.ka_.renew()}catch(w){}if(typeof p=="string"){let[w,j]=R.is_jmsg(p);w?R.is_cfg_msg(j)?h.cfg_handle_(j,v,b,h):R.is_pong_msg(j)||(R.is_ping_msg(j)?v.send(R.creat_send_pong_msg(h.cfg_.keepaliveInterval)):R.is_jrr_creq_msg(j)?console.log(R.ERROR.cant_use_creq_from_server):R.is_jrr_sres_msg(j)?b[Ne](j):R.is_jrr_sreq_msg(j)?h.sreq_handle_(j,v,b,h):R.is_jrr_cres_msg(j)?console.log(R.ERROR.cant_use_cres_from_server):h.json_handle_(j,v,b,h)):h.str_handle_(p.utf8Data,v,b,h)}else if(p instanceof ArrayBuffer){let w=new Uint8Array(p);h.bin_handle_(p.byteLength,w,v,b,h)}else if(p instanceof Blob){let w=await p.arrayBuffer();w=new Uint8Array(w),h.bin_handle_(p.size,w,v,b,h)}else console.log(qe.only_support_utf8_or_binary_or_json)},v.onclose=async function(D){let p=D.code,b=D.reason,w=v.sess_;w!==void 0&&(w.clear_katsk(),w.clear()),h.on_close_(p,b,v,w,h),h[J]||await Fe(h)},v.onerror=async function(D){let p=v.sess_;p!==void 0&&(p.clear_katsk(),p.clear());let b=D.code,w=D.reason;h.on_error_(b,w,v,p,h);try{await te(v)}catch(j){}await Fe(h)},m(h)},await f}catch(a){console.log("conn-fail");let f=this;return f.cfg_.autoReconnect===!0?(console.log("auto-reconn-after",f.cfg_.autoReconnectInterval),await ct(f.cfg_.autoReconnectInterval),console.log("fst retry"),await f.start(f.#r,f.#n)):null}}disable_auto_reconn(){this.cfg_.autoReconnect=!1}enable_auto_reconn(){this.cfg_.autoReconnect=!0}async close(t=!0,n=z.unknown,a="unknown"){t?this[J]=!0:this[J]=!1;let f=await te(this.sess_.conn_,n,a),m=this.sess_;return m!==void 0&&(m.clear_katsk(),m.clear()),clearInterval(this.#f),f}async restart(){return await this.close(!1),await this.start(this.#r,this.#n)}get[Symbol.toStringTag](){return this.#s[Symbol.toStringTag]}};S.DFLT_CFG=ee;S.ERROR=qe;S.CLOSE_ERRORS=z;S.DFLT_CFG_HANDLE=re;S.DFLT_BIN_HANDLE=ne;S.DFLT_STR_HANDLE=_e;S.DFLT_JSON_HANDLE=se;S.DFLT_SREQ_HANDLE=ie;S.DFLT_ON_CLOSE=Le;S.DFLT_ON_ERROR=Ce;S.DFLT_CHECK_NETWORK_BEFORE_RECONN=B;S.to_u8ary=R.to_u8ary;S.ato_u8ary=R.ato_u8ary;xe.exports=S});return pt();})();