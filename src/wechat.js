const { Wechaty } = require('wechaty')
const reply = require('./reply')
const remind = require('./remind');
const qrcodeMaker = require('qrcode-terminal')

let isGenerated = false

function initWechat() {
    const bot = new Wechaty()
    exports.bot = bot
    bot
        .on('scan', qrcode  => {
            if (isGenerated) return;
            isGenerated = true
            qrcodeMaker.generate(qrcode);
        })
        .on('login', user => {
            console.log('登录成功：' + JSON.stringify(user));
            remind();
        })
        .on('message', reply)
        .on('friendship',  friendship => console.log('收到好友请求：' + friendship))
        .on('room-invite', invitation => console.log('收到入群邀请：' + invitation))
        .start()
}

exports.initWechat = initWechat

