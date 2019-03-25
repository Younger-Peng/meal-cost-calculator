const fs = require('fs');
const keepAccounts = require('./account');

async function reply(msg) {
    const contact = msg.from();
    const content = msg.text();
    const room = msg.room();
    debugger;
    if (!room) return;
    const name = await contact.alias() || contact.name();
    const roomName = await room.topic();
    debugger;
    if (roomName !== '前端小分队') return;
    const money = parseFloat(content);
    debugger;
    if (typeof money !== 'number') return;

    // 充值
    if (content.startsWith('+') && money >= 0) {
        const result = await keepAccounts(name, money, 'charge')
        debugger;
        if (!result) {
            room.say('充值失败', [contact])
        } else {
            let text = '';
            Object.keys(result)
                .forEach(key => {
                    text += `\n${key}: ${result[key]}`
                });
            console.log(text)
            room.say(text, [contact])
        }

    // 消费
    } else if (content.startsWith('-') && money <= 0) {
        debugger;
        const result = await keepAccounts(name, money, 'consume')
        debugger;
        if (!result) {
            room.say('扣款失败', [contact])
        } else {
            let text = '';
            Object.keys(result)
                .forEach(key => {
                    text += `\n${key}: ${result[key]}`
                });
            console.log(text)
            room.say(text, [contact])
        }
    }
}

module.exports = reply