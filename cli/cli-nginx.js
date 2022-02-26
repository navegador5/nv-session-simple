#!/usr/bin/env node
const fs = require("fs");
const path = require("path");


const creat_argv = require("nv-cli-basic");


const  {
    DFLT_CFG,
    creat_ip_port_tem,
    creat_usock_tem,
} = require("./nginx/tem");


const cfg = {
    alias: {
        'external_ip':'I',
        'external_port':'P',
        'external_route':'R',
        'external_ssl':'S',
        'external_ssl_cert':'C',
        'external_ssl_key':'K',
        'external_http2':'T',
        'internal_is_usock':'k',
        'internal_usock':'u',
        'internal_ip':'i',
        'internal_port':'p',
        'internal_route':'r',
        'help':'h',
    },
    defaults: {
        external_ip:'192.168.1.103',
        external_port:'',
        external_route:'/',
        external_ssl:true,
        external_http2:false,
        internal_is_usock:true,
        internal_ip:'127.0.0.1',
        internal_port:'',
        internal_route:'/',
    },
    description: {
        'external_ip':'external ip listen on,default 192.168.1.103',
        'external_port':'external port listen on,default empty string',
        'external_route':'external route, default us "/"',
        'external_ssl':'external ssl, default true',
        'external_ssl_cert':'ssl cert',
        'external_ssl_key':'ssl key',
        'external_http2':'external using http2, default false',
        'internal_is_usock':'internal using unix_sock,defualt true',
        'internal_usock':'unix_sock path, default ./___usock___',
        'internal_ip':'internal proxy_pass ip, default 127.0.0.1,USELESS if using usock',
        'internal_port':'internal proxy_pass port,default empty string, USELESS if using usock',
        'internal_route':'internal proxy_pass route,default "/",USELESS if using usock',
        'help':"usage",
    },
    boolean: ["help","external_ssl","external_http2","internal_is_usock"],
    string:['external_ip','external_port','external_route','external_ssl_cert','external_ssl_key','internal_usock','internal_ip','internal_port','internal_route']
}



var argv = creat_argv(cfg);
////

const {fshow} = require("nv-facutil-basic");




if(argv.h) {
    var _usage = argv.usage('nv_sess_nginx');
    console.log(_usage);
    console.log("---example----")
    fshow(DFLT_CFG());
} else {
    let D = {
          external_ip: argv.I,
          external_port: argv.P,
          external_route: argv.R,
          external_ssl: argv.S,
          external_ssl_cert: argv.C,
          external_ssl_key: argv.K,
          external_http2: argv.T,
          internal_is_usock: argv.k,
          internal_usock: argv.u,
          internal_ip: argv.i,
          internal_port: argv.p,
          internal_route: argv.r
    }
    if(argv.S) {
        if(D.external_ssl_cert === '') {
            delete D.external_ssl_cert
        } 
        if(D.external_ssl_key === '') {
            delete D.external_ssl_key
        }
    } else {}
    
    let cfg = DFLT_CFG();
    Object.assign(cfg,D);
    var worker_rlimit_nofile,events,http_upgrade,server;
    if(!argv.k) {
        var {worker_rlimit_nofile,events,http_upgrade,server} = creat_ip_port_tem(cfg);
    } else {
        var {worker_rlimit_nofile,events,http_upgrade,server} = creat_usock_tem(cfg);
    }
    console.log("#----worker_rlimit_nofile---")
    console.log(worker_rlimit_nofile)
    console.log("#----events---")
    console.log(events)
    console.log("#----$http_upgrade-----")
    console.log(http_upgrade)
    console.log("#-----server-----")
    console.log(server)
}

