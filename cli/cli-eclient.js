#!/usr/bin/env node
const fs = require("fs");
const path = require("path");


const creat_argv = require("nv-cli-basic");

const {
    DFLT_CFG,
    creat_tem,
} = require("./client/external-tem");



const cfg = {
    alias: {
        'sec_websocket_protocol':'c',
        'external_ip':'I',
        'external_port':'P',
        'external_route':'R',
        'external_ssl':'S',
        'help':'h',
    },
    defaults: {
        external_ip:'192.168.1.103',
        external_port:'',
        external_route:'/',
        external_ssl:true,
    },
    description: {
        'sec_websocket_protocol':'second websocket protocol,default undefined',
        'external_ip':'external ip listen on,default 192.168.1.103',
        'external_port':'external port listen on,default empty string',
        'external_route':'external route, default us "/"',
        'external_ssl':'external ssl, default true',
        'help':"usage",
    },
    boolean: ["help","external_ssl"],
    string:["external_ip","external_port","external_route",'sec_websocket_protocol']
}



var argv = creat_argv(cfg);
////

const {fshow} = require("nv-facutil-basic");

const {
    try_install_local_save,
    check_cmd_and_try_install_gloal
} = require("nv-cli-pkg");

if(argv.h) {
    var _usage = argv.usage('nv_sess_external_client');
    console.log(_usage);
    console.log("---example----")
    fshow(DFLT_CFG());
} else {
    let D = {
        'sec_websocket_protocol':argv.c,
          external_ip: argv.I,
          external_port: argv.P,
          external_route: argv.R,
          external_ssl: argv.S,    
    }
    if(D.sec_websocket_protocol === '') {
        D.sec_websocket_protocol = undefined;
    } else {}
    let cfg = DFLT_CFG();
    Object.assign(cfg,D);
    ////
    let client = creat_tem(argv.S,argv.I,argv.P,argv.R,cfg.sec_websocket_protocol) 
    let curr_dir = process.cwd();
    ////
    fs.writeFileSync(path.join(curr_dir,"eclient.js"),client+'\n');
    ////
    check_cmd_and_try_install_gloal('nv-session-simple','nv_sess_bw','Bwsess');
    try_install_local_save('nv-session-simple');
}

