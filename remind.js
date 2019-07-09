const { dbs } = require('./mongo');
let remindTimer;

function remind(room) {
    remindTimer && clearTimeout(remindTimer);
    let now = Date.now();
    let targetTime = new Date();
    targetTime.setHours(20, 0, 0); // 每天晚上8点整
    remindTimer = setTimeout(() => {
        let yearMonthDate = new Date().toISOString().slice(0, 10);
        let regexp = new RegExp(yearMonthDate);
        const cost = dbs.mealfee.collection('cost');
        let individualFee = {};
        cost.find({ 'time': { '$regex': regexp } })
            .toArray(async (err, docs) => {
                if (err) {
                    console.log(err)
                } else {
                    docs.forEach(doc => {
                        if (!individualFee[doc.name]) {
                            individualFee[doc.name] = `${doc.fee}`
                        } else {
                            individualFee[doc.name] += `, ${doc.fee}`
                        }
                    });
                    let content = `${yearMonthDate}\n今日消费：\n\n`;
                    for (const name in individualFee) {
                        content += `${name}: ${individualFee[name]}\n`
                    }
                    await room.say(content);
                }
            });
    }, targetTime.valueOf() - now);
}

module.exports = remind;