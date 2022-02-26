#!/usr/bin/env node
const fs = require("fs");
const path = require("path");


const creat_argv = require("nv-cli-basic");

const {
    DFLT_CFG,
    creat_usock_tem, 
    creat_port_tem,
} = require("./client/internal-tem");



const cfg = {
    alias: {
        'sec_websocket_protocol':'c',
        'internal_is_usock':'k',
        'internal_usock':'u',
        'internal_port':'p',
        'internal_ssl':'S',
        'help':'h',
    },
    defaults: {
        internal_is_usock:true,
        internal_port:'',
    },
    description: {
        'sec_websocket_protocol':'second websocket protocol,default undefined',
        'internal_is_usock':'internal using unix_sock,defualt true',
        'internal_usock':'unix_sock path, default ./___usock___',
        'internal_port':'internal proxy_pass port,default empty string, USELESS if using usock',
        'internal_ssl':'internal ssl, default false,USELESS if using usock',
        'help':"usage",
    },
    boolean: ["help","internal_is_usock","internal_ssl"],
    string:['internal_usock','internal_port','sec_websocket_protocol']
}



var argv = creat_argv(cfg);
////

const {fshow} = require("nv-facutil-basic");

const {
    try_install_local_save,
    check_cmd_and_try_install_gloal
} = require("nv-cli-pkg");

if(argv.h) {
    var _usage = argv.usage('nv_sess_internal_client');
    console.log(_usage);
    console.log("---example----")
    fshow(DFLT_CFG());
} else {
    let D = {
        'sec_websocket_protocol':argv.c,
        'internal_is_usock':argv.k,
        'internal_usock':argv.u,
        'internal_port':argv.p,
        'internal_ssl':argv.S,
    }
    if(D.sec_websocket_protocol === '') {
        D.sec_websocket_protocol = undefined;
    } else {}
    let cfg = DFLT_CFG();
    Object.assign(cfg,D);
    ////
    let client;
    if(cfg.internal_is_usock) {
        if(cfg.internal_usock === '') {cfg.internal_usock = undefined}
        client = creat_usock_tem(argv.S,cfg.internal_usock,cfg.sec_websocket_protocol) 
    } else {
        client  = creat_port_tem(argv.S,cfg.internal_port,cfg.sec_websocket_protocol)
    }
    ////
    let curr_dir = process.cwd();
    ////
    fs.writeFileSync(path.join(curr_dir,"iclient.js"),client+'\n');
    ////
    check_cmd_and_try_install_gloal('nv-session-simple','nv_sess_bw','Bwsess');
    try_install_local_save('nv-session-simple');
}

