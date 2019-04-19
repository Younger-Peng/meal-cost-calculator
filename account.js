// const fs = require('fs');
// const filePath = require('./config.js').jsonFile;

// function fetchRecord() {
//     return new Promise((resolve, reject) => {
//         fs.readFile(filePath, (err, data) => {
//             if (err) {
//                 reject(null);
//             } else {
//                 resolve(JSON.parse(data.toString()));
//             }
//         });
//     });
// }

// function updateRecord(str) {
//     return new Promise((resolve, reject) => {
//         fs.writeFile(filePath, str, {flag: 'w'}, err => {
//             if (err) {
//                 reject('Oops, charge failed!')
//             } else {
//                 resolve()
//             }
//         })
//     })
// }

// async function keepAccounts(name, money) {
//     let oldFee;
//     try {
//         oldFee = await fetchRecord();
//     } catch(err) {
//         console.log(err);
//         return null
//     }
//     const newFee = {
//         ...oldFee,
//         [name]: oldFee[name] + money
//     };
//     try {
//         await updateRecord(JSON.stringify(newFee));
//     } catch(err) {
//         console.log(err);
//         return null;
//     }

//     return newFee;
// }

// module.exports = keepAccounts;

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