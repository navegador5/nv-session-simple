#!/usr/bin/env node

const {fshow} = require("nv-facutil-basic");

const {VALI_HREQ_TEM} = require("../srv/srv-vali");
fshow(VALI_HREQ_TEM());
