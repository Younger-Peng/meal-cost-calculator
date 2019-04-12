const express = require('express')
const app = express()
const port = 3000
const db = require('./mongo');
const wx = require('./wechat');

app.use(express.static(__dirname + '/public'));
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
        const { mealfee } = db.dbs;
        const sum = mealfee.collection('sum');
        sum.find({}).toArray((err, items) => {
            res.json({ items });
        });
    })
}