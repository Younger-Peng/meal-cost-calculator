const { Wechaty } = require('wechaty')
const http = require('http')
const cp = require('child_process')
const reply = require('./reply')
const remind = require('./remind');

let isGenerated = false

const htmlFilePath = require('path').join(__dirname, 'qrcode.html')

function initWechat() {
    const bot = new Wechaty()
    exports.bot = bot
    bot
        .on('scan', qrcode  => {
            if (isGenerated) return;
            isGenerated = true
            require('fs').writeFile('qrcode.js', `var url = "${qrcode}"`, { flag: 'w' }, err => {
                if (err) return console.log(err);
                if (process.platform === 'darwin') {
                    cp.exec(`open file:///${htmlFilePath}`)
                } else if (process.platform === 'win32') {
                    cp.exec(`start chrome file:///${htmlFilePath}`)
                }
            })
        })
        .on('login', async user => {
            console.log('登录成功：' + JSON.stringify(user));
            await sleep(10 * 1000);
            const targetRoom = await bot.Room.find({ topic: '前端小分队' });
            if (targetRoom) remind(targetRoom);
        })
        .on('message', reply)
        .on('friendship',  friendship => console.log('收到好友请求：' + friendship))
        .on('room-invite', invitation => console.log('收到入群邀请：' + invitation))
        .start()
}

exports.initWechat = initWechat

function sleep(miliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, miliseconds)
    })
}