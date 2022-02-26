#!/usr/bin/env node
const fs = require("fs");
const path = require("path");


const creat_argv = require("nv-cli-basic");

const {
    creat_tem,
    DFLT_CFG,
} = require("./browser/tem");



const cfg = {
    alias: {
        'creat_func_name':'n',
        'sec_websocket_protocol':'c',
        'external_ip':'I',
        'external_port':'P',
        'external_route':'R',
        'external_ssl':'S',
        'help':'h',
    },
    defaults: {
        creat_func_name:'bwsess_connect',
        external_ip:'192.168.1.103',
        external_port:'',
        external_route:'/',
        external_ssl:true,
    },
    description: {
        'creat_func_name':'creat_func_name, default bwsess_connect',
        'sec_websocket_protocol':'second websocket protocol,default undefined',
        'external_ip':'external ip listen on,default 192.168.1.103',
        'external_port':'external port listen on,default empty string',
        'external_route':'external route, default us "/"',
        'external_ssl':'external ssl, default true',
        'help':"usage",
    },
    boolean: ["help","external_ssl"],
    string:["external_ip","external_port","external_route",'sec_websocket_protocol','creat_func_name']
}



var argv = creat_argv(cfg);
////

const {fshow} = require("nv-facutil-basic");





if(argv.h) {
    var _usage = argv.usage('nv_sess_bclient');
    console.log(_usage);
    console.log("---example----")
    fshow(DFLT_CFG());
} else {
    let D = {
          creat_func_name:argv.n,
          sec_websocket_protocol:argv.c,
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
    let client = creat_tem(argv.n,argv.S,argv.I,argv.P,argv.R,cfg.sec_websocket_protocol) 
    let curr_dir = process.cwd();
    ////
    fs.writeFileSync(path.join(curr_dir,"bclient.js"),client+'\n');
    ////
}

