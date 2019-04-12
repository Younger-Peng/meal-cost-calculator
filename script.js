const mongo = require('./mongo');
const { FileBox } = require('file-box');
const { ObjectID: ObjectId } = require('mongodb');

async function main() {
    await mongo.connect();
    // mongo.dbs.mealfee.collection('sum').insertOne({
    //     cash: [
    //         { name: '彭扬', total: 100 },
    //         { name: '许恒路', total: 100 },
    //         { name: '李金刚', total: 100 }
    //     ],
    //     total: 300
    // }, (err, res) => {
    //     if (err) return console.log(err);
    //     console.log('ok');
    //     process.exit(0);
    // });
    const sum = mongo.dbs.mealfee.collection('sum');
    sum.findOne({}, (err, res) => {
        if (err) return console.log(err);
        res.cash.find(item => item.name === '彭扬').total += -10;
        res.total += -10;
        sum.updateOne({_id: ObjectId(res._id)}, {$set: { cash: res.cash, total: res.total}}).then(result => {
            console.log('success')
            process.exit(0);
        })
    })
}

// main();

const sumImg = FileBox.fromFile('D:/learn/wc/sum.png');
// console.log(__dirname)

console.log(sumImg);