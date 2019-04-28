const fs = require('fs');
const { FileBox } = require('file-box');
const { keepAccounts } = require('./account');
const { roomName: targetRoomName } = require('./config');
const genImg = require('./ptr')
const admin = '张芳'

async function reply(msg) {
    const contact = msg.from();
    const content = msg.text();
    const contactList = await msg.mention();
    const room = msg.room();
    if (!room) return;
    const name = await contact.alias() || contact.name();
    const roomName = await room.topic();
    // console.log({ roomName, name, content })
    if (roomName !== targetRoomName) return;

    // 成员消费 或者 管理员给自己充值
    if (
        content.startsWith('-') ||
        content.startsWith('+') && name === admin
    ) {
        const money = parseFloat(content);
        if (isNaN(money)) return
        await recordAndRespond(name, money, room, [contact])
    }
    // 管理员为其他成员充值
    else {
        if (name !== admin) return
        // 只有张芳有充值的权限
        if (content.startsWith('+') && name !== admin) {
            return await room.say(`您没有充值的权限\n请联系 ${admin} 帮您充值\n充值格式:\n@James +100`)
        }
        const [ mention, number ] = content.split(String.fromCharCode(8197))
        if (!number || !number.startsWith('+')) return
        const money = parseFloat(number)
        if (isNaN(money)) return
        const member = await room.member(mention.substring(1))
        if (!member) return
        const alias = await member.alias();
        if (!alias) return
        await recordAndRespond(alias, money, room, [contact, member])
    }
}

async function recordAndRespond(name, money, room, mentions) {
    try {
        await keepAccounts(name, money);
        await genImg();
        const sumImg = FileBox.fromFile('D:/learn/wc/sum.png');
        await room.say(sumImg, mentions)
    } catch(err) {
        console.log(err);
        await room.say('Fail，Please contact PengYang', mentions)
    }
}

module.exports = reply