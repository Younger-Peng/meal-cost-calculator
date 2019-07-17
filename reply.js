const fs = require('fs');
const { FileBox } = require('file-box');
const { keepAccounts } = require('./account');
const { roomName: targetRoomName, admin } = require('./config');
const remind = require('./remind');

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
        remind(name);
        await recordAndRespond(name, money, room, [contact])
    }
    // 管理员为其他成员充值
    else {
        // 只有张芳有充值的权限
        if (content.startsWith('+') && name !== admin) {
            return await room.say(`您没有充值的权限\n请联系 ${admin} 帮您充值\n充值格式:\n@James +100`)
        }
        if (name !== admin) return
        const [ mention, number ] = content.split(String.fromCharCode(8197))
        const shortName = mention.substring(1).replace(/<img.{1,}?\/>/g, '')
        if (!number || !number.startsWith('+')) {
            return
        }
        const money = parseFloat(number)
        if (isNaN(money)) {
            console.log('不是数字', number)
            return
        }
        
        // This is a bug from library, you can not find a contact with it's fullname when
        // it's name contains images, instead you have to remove all images, and the string
        // left maybe usefull to find the target member
        const member = await room.member(shortName)

        if (!member) {
            console.log(shortName, 'member 未找到 33333333333333333333333')
            return await room.say('Oops, 未找到您提到的成员!', [contact])
        }
        const alias = await member.alias() || member.name();
        if (!alias) {
            console.log(member.alias(), '别名不存在44444444444444444')
            return
        }
        remind(alias);
        await recordAndRespond(alias, money, room, [contact, member]);
    }
}

async function recordAndRespond(name, money, room, mentions) {
    try {
        const sum = await keepAccounts(name, money);
        const {cash, total} = sum;
        let remain = `\n总计: ${total}\n`

        cash.sort((a, b) => b.total - a.total)
            .forEach(person => {
                remain += `${person.name}：${person.total}\n`;
            });

        await room.say(remain, mentions)
    } catch(err) {
        console.log(err);
        await room.say('Fail，Please contact PengYang', mentions)
    }
}

module.exports = reply