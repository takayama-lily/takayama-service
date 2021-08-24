'use strict'
const MJBot = require('./mjbot')

const config = { }
config['cn.account'] = process.env.MAJSOUL_CN_ACCOUNT
config['cn.password'] = process.env.MAJSOUL_CN_PASSWORD

const mjsoul = new MJBot({
    url: 'wss://gateway-cdn.maj-soul.com/gateway'
})
mjsoul.login(config['cn.account'], config['cn.password'])


module.exports = mjsoul
