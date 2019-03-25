const { Wechaty } = require('wechaty')
const http = require('http')
const cp = require('child_process')
const reply = require('./reply')

let isGenerated = false

const htmlFilePath = require('path').join(__dirname, 'qrcode.html')

Wechaty.instance()
.on('scan', qrcode  => {
    if (isGenerated) return;
    isGenerated = true
    qrcode = encodeURIComponent(qrcode)
    if (process.platform === 'darwin') {
        cp.exec(`open file:///${htmlFilePath}?url=${qrcode}`)
    } else if (process.platform === 'win32') {
        cp.exec(`start chrome file:///${htmlFilePath}?url=${qrcode}`)
    }
})
.on('login',       user    => {
    console.log('登录成功：' + JSON.stringify(user))
})
.on('message', reply)
.on('friendship',  friendship => console.log('收到好友请求：' + friendship))
.on('room-invite', invitation => console.log('收到入群邀请：' + invitation))
.start()