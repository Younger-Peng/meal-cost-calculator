const db = require('./mongo');
const wx = require('./wechat');

main();

async function main() {
    await db.connect();
    wx.initWechat();
}
