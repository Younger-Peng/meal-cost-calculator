const fs = require('fs');
const filePath = __dirname + '/bank.json';

function fetchRecord() {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(null);
            } else {
                resolve(JSON.parse(data.toString()));
            }
        });
    });
}

function updateRecord(str) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, str, {flag: 'w'}, err => {
            if (err) {
                reject('Oops, charge failed!')
            } else {
                resolve()
            }
        })
    })
}

async function keepAccounts(name, money) {
    debugger;
    let oldFee;
    try {
        oldFee = await fetchRecord();
        debugger;
    } catch(err) {
        console.log(err);
        return null
    }
    console.log(oldFee)
    const newFee = {
        ...oldFee,
        [name]: oldFee[name] + money,
        total: oldFee.total + money
    };
    console.log(newFee)
    try {
        await updateRecord(JSON.stringify(newFee));
        debugger;
    } catch(err) {
        console.log(err);
        return null;
    }

    return newFee;
}

module.exports = keepAccounts;