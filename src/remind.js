let remindTimer;
const { getDailyCost } = require('./leancloud')
const { roomName, remindTime } = require('./config')

function remind(alias) {
    console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString(), alias || '');
    remindTimer && clearTimeout(remindTimer);
    let now = Date.now();
    let targetTime = new Date();
    targetTime.setHours(remindTime.hours, remindTime.minutes, remindTime.seconds); // 每天晚上8点整
    remindTimer = setTimeout(async () => {

        let yearMonthDate = new Date().toISOString().slice(0, 10);
        let content = `${yearMonthDate}\n今日消费：\n\n`;
        const costs = await getDailyCost()
        costs.forEach(cost => {
            content += `${cost.name}: ${cost.fee}\n`
        })
        await sleep(10 * 1000);
        const targetRoom = await require('./wechat').bot.Room.find({ topic: roomName });
        if (!targetRoom) {
            console.log(new Date().toLocaleDateString(), new Date().toLocaleTimeString());
            console.log('fail')
        } else {
            await targetRoom.say(content);
        }
    }, targetTime.valueOf() - now);
}

module.exports = remind;

function sleep(miliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, miliseconds)
    })
}