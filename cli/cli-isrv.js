#!/usr/bin/env node
const fs = require("fs");
const path = require("path");


const creat_argv = require("nv-cli-basic");

const {
    DFLT_CFG,
    creat_non_forward_usock_tem,
    creat_forward_usock_tem, 
    creat_non_forward_port_tem,
    creat_forward_port_tem,
} = require("./srv/tem");



const cfg = {
    alias: {
        'nginx_user':'U',
        'sec_websocket_protocol':'c',
        'internal_is_usock':'k',
        'forward':'F',
        'internal_usock':'u',
        'internal_port':'p',
        'internal_ssl':'S',
        'internal_ssl_cert':'C',
        'internal_ssl_key':'K',
        'help':'h',
    },
    defaults: {
        nginx_user:'www-data',
        internal_is_usock:true,
        internal_ip:'127.0.0.1',
        internal_port:'',
        internal_route:'/',
    },
    description: {
        'nginx_user':'nginx user, default www-data',
        'sec_websocket_protocol':'second websocket protocol,default undefined',
        'internal_is_usock':'internal using unix_sock,defualt true',
        'forward':'server is for forwarding, default false',
        'internal_usock':'unix_sock path, default ./___usock___',
        'internal_port':'internal proxy_pass port,default empty string, USELESS if using usock',
        'internal_ssl':'internal ssl, default false',
        'internal_ssl_cert':'ssl cert',
        'internal_ssl_key':'ssl key',
        'help':"usage",
    },
    boolean: ["help","forward","internal_ssl","internal_is_usock"],
    string:['internal_usock','internal_port','nginx_user','sec_websocket_protocol']
}



var argv = creat_argv(cfg);
////

const {fshow} = require("nv-facutil-basic");

const {
    try_install_local_save,
    check_cmd_and_try_install_gloal
} = require("nv-cli-pkg");

if(argv.h) {
    var _usage = argv.usage('nv_sess_internal_srv');
    console.log(_usage);
    console.log("---example----")
    fshow(DFLT_CFG());
} else {
    let D = {
        'nginx_user':argv.U,
        'sec_websocket_protocol':argv.c,
        'internal_is_usock':argv.k,
        'forward':argv.F,
        'internal_usock':argv.u,
        'internal_port':argv.p,
        'internal_ssl':argv.S,
        'internal_ssl_cert':argv.C,
        'internal_ssl_key':argv.K
    }
    if(D.sec_websocket_protocol === '') {
        D.sec_websocket_protocol = undefined;
    } else {}
    let cfg = DFLT_CFG();
    Object.assign(cfg,D);
    ////
    let scheme;
    if(argv.S) {
        scheme = 'https';
        if(D.internal_ssl_cert === '') {
            delete D.internal_ssl_cert
        }
        if(D.internal_ssl_key === '') {
            delete D.internal_ssl_key
        }
    } else {}
    ////
    let srv;
    if(cfg.internal_is_usock) {
        if(cfg.internal_usock === '') {cfg.internal_usock = undefined}
        if(argv.F) {
            srv = creat_forward_usock_tem(cfg.internal_usock,cfg.sec_websocket_protocol) 
        } else {
            srv = creat_non_forward_usock_tem(cfg.internal_usock,cfg.sec_websocket_protocol)
        }
    } else {
        if(argv.F) {
            srv = creat_forward_port_tem(cfg.internal_port,cfg.sec_websocket_protocol,scheme,{key:cfg.internal_ssl_key,cert:cfg.internal_ssl_cert})
        } else {
            srv = creat_non_forward_port_tem(cfg.internal_port,cfg.sec_websocket_protocol,scheme,{key:cfg.internal_ssl_key,cert:cfg.internal_ssl_cert})
        }
    }
    ////
    let curr_dir = process.cwd();
    ////
    fs.writeFileSync(path.join(curr_dir,"srv.js"),srv+'\n');
    ////
    check_cmd_and_try_install_gloal('nv-session-simple','nv_sess_bw','Bwsess');
    try_install_local_save('nv-session-simple');
}

