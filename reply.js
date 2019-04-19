const fs = require('fs');
const { FileBox } = require('file-box');
const { keepAccounts } = require('./account');
const { roomName: targetRoomName } = require('./config');
const genImg = require('./ptr')
const { gossip } = require('./chatbot');

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
    const money = parseFloat(content);
    if (isNaN(money)) {
        // if (contact.self()) return;
        // console.log('闲聊时间');
        // const reply = await gossip(content);
        // await room.say(reply, contact)
    } else {
        if (content.startsWith('-') || content.startsWith('+')) {
            try {
                await keepAccounts(name, money);
                await genImg();
                const sumImg = FileBox.fromFile('D:/learn/wc/sum.png');
                await room.say(sumImg, [contact])
            } catch(err) {
                console.log(err);
                room.say('Fail', [contact])
            }
        }
    }

    // 充值
    // if (content.startsWith('+') && money >= 0) {
    //     const result = await keepAccounts(name, money, 'charge')
    //     if (!result) {
    //         room.say('充值失败', [contact])
    //     } else {
    //         let text = '';
    //         let total = 0;
    //         Object.keys(result)
    //             .forEach(key => {
    //                 text += `\n${key}: ${result[key]}`;
    //                 total += result[key];
    //             });
    //         text += `\ntotal: ${total}`;
    //         // console.log(text)
    //         room.say(text, [contact])
    //     }

    // // 消费
    // } else if (content.startsWith('-') && money <= 0) {
    //     const result = await keepAccounts(name, money, 'consume')
    //     if (!result) {
    //         room.say('扣款失败', [contact])
    //     } else {
    //         let text = '';
    //         let total = 0;
    //         Object.keys(result)
    //             .forEach(key => {
    //                 text += `\n${key}: ${result[key]}`;
    //                 total += result[key];
    //             });
    //         text += `\ntotal: ${total}`;
    //         // console.log(text)
    //         room.say(text, [contact])
    //     }
    // }
}

module.exports = reply