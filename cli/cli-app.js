#!/usr/bin/env node
const fs = require("fs");
const path = require("path");


const creat_argv = require("nv-cli-basic");


const DFLT_CFG = ()=>({
    ////
    external_ip:'192.168.1.103',
    external_port:'18890',
    external_route:'/',
    external_ssl_cert:path.join(__dirname,'../../srv/cert/https-tst.cert'),
    external_ssl_key:path.join(__dirname,'../../srv/cert/https-tst.key'),
    external_http2:false,
    ////
    internal_usock:undefined,  //IF undefined : ./___usock___
    sec_websocket_protocol: undefined,
    forward:false,                     //  server is for forwarding, default false
    //////
    nginx_user:'www-data',     //chown usock to nginx  USELESS when USING  ip:port@optional
    creat_func_name:'bwsess_connect'
});


const _nginx = require("./nginx/tem");
//_nginx.creat_usock_tem

const _srv = require("./srv/tem");
//_srv.creat_non_forward_usock_tem
//_srv.creat_forward_usock_tem

const _iclient = require("./client/internal-tem");
//_iclient.creat_usock_tem

const _eclient = require("./client/external-tem");
//_eclient.creat_tem

const _bclient = require("./browser/tem");
//_bclient.creat_tem



const cfg = {
    alias: {
        'external_ip':'I',
        'external_port':'P',
        'external_route':'R',
        'external_ssl_cert':'C',
        'external_ssl_key':'K',
        'external_http2':'T',
        'internal_usock':'u',
        'nginx_user':'U',
        'sec_websocket_protocol':'c',
        'forward':'F',
        'creat_func_name':'n',
        'help':'h',
    },
    defaults: {
        external_ip:'192.168.1.103',
        external_port:'',
        external_route:'/',
        external_http2:false,
        nginx_user:'www-data',
        creat_func_name:'bwsess_connect',
    },
    description: {
        'external_ip':'external ip listen on,default 192.168.1.103',
        'external_port':'external port listen on,default empty string',
        'external_route':'external route, default us "/"',
        'external_ssl_cert':'ssl cert',
        'external_ssl_key':'ssl key',
        'external_http2':'external using http2, default false',
        'internal_usock':'unix_sock path, default ./___usock___',
        'nginx_user':'nginx user, default www-data',
        'sec_websocket_protocol':'second websocket protocol,default undefined',
        'forward':'server is for forwarding, default false',
        'creat_func_name':'creat_func_name, default bwsess_connect',
        'help':"usage",
    },
    boolean: ["help","external_http2","forward"],
    string:['external_ip','external_port','external_route','external_ssl_cert','external_ssl_key','internal_usock','nginx_user','sec_websocket_protocol','creat_func_name']
}



var argv = creat_argv(cfg);
////

const {fshow,jdcp} = require("nv-facutil-basic");

const {
    try_install_local_save,
    check_cmd_and_try_install_gloal
} = require("nv-cli-pkg");


if(argv.h) {
    var _usage = argv.usage('nv_sess_app');
    console.log(_usage);
    console.log("---example----")
    fshow(DFLT_CFG());
} else {
    let D = {
          external_ip: argv.I,
          external_port: argv.P,
          external_route: argv.R,
          external_ssl_cert: argv.C,
          external_ssl_key: argv.K,
          external_http2: argv.T,
          internal_usock: argv.u,
          ////
          sec_websocket_protocol:argv.c,
          forward:argv.F,
          nginx_user:argv.U,
          creat_func_name:argv.n
    }
    //证书
    if(D.external_ssl_cert === '') {
        delete D.external_ssl_cert
    } 
    if(D.external_ssl_key === '') {
         delete D.external_ssl_key
    }
    //子协议
    if(D.sec_websocket_protocol === '') {
        D.sec_websocket_protocol = undefined;
    } else {}
    //外部必须使用 https
    ////
    let curr_dir = process.cwd();
    let cfg = DFLT_CFG();
    Object.assign(cfg,D);
    //usock
    if(cfg.internal_usock === '') {cfg.internal_usock = undefined}
    ////----nginx
    let ngcfg = jdcp(cfg);
    ngcfg.external_ssl = true;
    let {worker_rlimit_nofile,events,http_upgrade,server} = _nginx.creat_usock_tem(ngcfg);
    let ngtxt = [
        "#----worker_rlimit_nofile-----",worker_rlimit_nofile,
        "#----events-----",events,
        "#----$http_upgrade-----",http_upgrade,
        "#-----server-----",server
    ];
    ngtxt = ngtxt.join("\n");
    fs.writeFileSync(path.join(curr_dir,'nginx.conf.part'),ngtxt);
    ////-isrv
    let srv;
    if(argv.F) {
        srv = _srv.creat_forward_usock_tem(cfg.internal_usock,cfg.sec_websocket_protocol)
    } else {
        srv = _srv.creat_non_forward_usock_tem(cfg.internal_usock,cfg.sec_websocket_protocol)
    }
    fs.writeFileSync(path.join(curr_dir,"srv.js"),srv+'\n');
    ////-iclient
    let iclient = _iclient.creat_usock_tem(true,cfg.internal_usock,cfg.sec_websocket_protocol);
    fs.writeFileSync(path.join(curr_dir,"iclient.js"),iclient+'\n'); 
    ////-eclient
    let eclient = _eclient.creat_tem(true,argv.I,argv.P,argv.R,cfg.sec_websocket_protocol)
    fs.writeFileSync(path.join(curr_dir,"eclient.js"),eclient+'\n');
    ////-bwcls
    let bwcls = fs.readFileSync(path.join(__dirname,"../browser","browser.js")).toString();
    fs.writeFileSync(path.join(curr_dir,"bwcls.js"),bwcls+'\n');
    ////-bclient
    let bclient = _bclient.creat_tem(argv.n,true,argv.I,argv.P,argv.R,cfg.sec_websocket_protocol) 
    fs.writeFileSync(path.join(curr_dir,"bclient.js"),bclient+'\n');
    ////
    let itst = require("./tst/server-and-iclient");
    fs.writeFileSync(path.join(curr_dir,"tst-server-and-iclient.js"),itst+'\n');
    let etst = require("./tst/eclient");
    fs.writeFileSync(path.join(curr_dir,"tst-eclient.js"),etst+'\n');
    let btst = require("./tst/browser");
    fs.writeFileSync(path.join(curr_dir,"tst-browser.js"),btst+'\n');
    ////
    check_cmd_and_try_install_gloal('nv-session-simple','nv_sess_bw','Bwsess');
    try_install_local_save('nv-session-simple');
}

