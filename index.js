const express = require('express')
const app = express()
const port = 3000
const db = require('./mongo');
const wx = require('./wechat');

main();

async function main() {
    await db.connect();
    addListeners(app);
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    wx.initWechat();
}

function addListeners(app) {
    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/data', (req, res) => {
        const { mealFee } = db.dbs;
        const cost = mealFee.collection('cost');
        cost.find({}).toArray((err, items) => {
            res.json({ items });
        });
    })
}