const { dbs } = require('./mongo');
const { ObjectID: ObjectId } = require('mongodb');

async function keepAccounts(name, money) {
    await updateMember(name, money);
    await updateSum(name, money);
}

function updateMember(name, money) {
    const cost = dbs.mealfee.collection('cost');
    return new Promise((resolve, reject) => {
        cost.insertOne({ name, fee: money, time: new Date().toISOString() }, (err, res) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function updateSum(name, money) {
    const sum = dbs.mealfee.collection('sum');
    return new Promise((resolve, reject) => {
        sum.findOne({}, (err, res) => {
            if (err) {
                reject(err);
            } else {
                const targetPerson = res.cash.find(item => item.name === name);
                if (targetPerson) {
                    targetPerson.total = round(targetPerson.total + money, 2);
                } else {
                    res.cash.push({
                        name,
                        total: money
                    });
                }
                res.total = round(res.total + money, 2)
                sum.updateOne(
                    {_id: ObjectId(res._id)},
                    {$set: {
                        cash: res.cash,
                        total: res.total
                    }},
                    (err, res) => {
                        if (err) reject(err);
                        else resolve();
                    });
            }
        })
    });
}

module.exports = {
    keepAccounts,
}

function round(number, precision) {
    return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
}