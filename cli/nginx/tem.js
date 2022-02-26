const EVENTS =`
events {
    worker_connections 60000;
    # multi_accept on;
}
`;


const HTTP_UPGRADE = `
map \$http_upgrade \$connection_upgrade {
    default upgrade;
    ''      close;
}
`;

const CMMN = `
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP       $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
`

const path = require("path");


const DFLT_CFG = ()=> ({
    ////
    external_ip:'192.168.1.103',
    external_port:'',
    external_route:'/',
    external_ssl:true,
    external_ssl_cert:path.join(__dirname,'../../srv/cert/https-tst.cert'),
    external_ssl_key:path.join(__dirname,'../../srv/cert/https-tst.key'),
    external_http2:false,
    ////
    internal_is_usock:true,
    internal_usock:undefined,  //IF undefined : ./___usock___
    internal_ip:'127.0.0.1',  //USELESS when USING usock
    internal_port:65512,      //USELESS when USING usock
    internal_route:'/'        //USELESS when USING usock
})




function get_listen(cfg) {
    let eip    = cfg.external_ip;
    let eport  = (cfg.external_port==='')?'':(':'+cfg.external_port);
    let ssl    = cfg.external_ssl?'ssl':'';
    let http2  = cfg.external_http2?'http2':'';
    return(`listen ${eip}${eport} ${ssl} ${http2};`)
}


function get_cert(cfg) {
    if(cfg.external_ssl) {
        let c = `ssl_certificate ${cfg.external_ssl_cert};`;
        let k = `ssl_certificate_key ${cfg.external_ssl_key};`;
        return([c,k])
    } else {
        return(['',''])
    }
}

function creat_ip_port_tem(cfg=DFLT_CFG()) {
    let listen = get_listen(cfg);
    let [cert,key] = get_cert(cfg);
    let external_route = cfg.external_route;
    let internal_route = cfg.internal_route;
    let s =`
    server {
        ${listen}
        ${cert}
        ${key}
        location ${external_route} {
            proxy_pass http://${cfg.internal_ip}${cfg.internal_port}${internal_route};
            ${CMMN}
        }
    }
`
    return({
        worker_rlimit_nofile:"worker_rlimit_nofile 60000",
        events:EVENTS,
        http_upgrade:HTTP_UPGRADE,
        server:s
    })	
}


const fs = require("fs");


function get_usock(cfg) {
    let usock = cfg.internal_usock;
    if(usock === undefined) {
        usock = path.join(process.cwd(),'___usock___');
    } else {}
    return(usock)
}

function creat_usock_tem(cfg=DFLT_CFG()) {
    let listen = get_listen(cfg);
    let [cert,key] = get_cert(cfg);
    let external_route = cfg.external_route;
    let usock = get_usock(cfg);
    let s =`
    server {
        ${listen}
        ${cert}
        ${key}
        location ${external_route} {
            proxy_pass http://unix:${usock};
            ${CMMN}
        }
    }
`
    return({
        worker_rlimit_nofile:"worker_rlimit_nofile 60000",
        events:EVENTS,
        http_upgrade:HTTP_UPGRADE,
        server:s
    })
}



module.exports = {
    DFLT_CFG,
    creat_ip_port_tem,
    creat_usock_tem,
}
