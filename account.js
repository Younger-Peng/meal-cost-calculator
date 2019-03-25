const fs = require('fs');
const filePath = require('./config.js').jsonFile;

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
    let oldFee;
    try {
        oldFee = await fetchRecord();
    } catch(err) {
        console.log(err);
        return null
    }
    const newFee = {
        ...oldFee,
        [name]: oldFee[name] + money
    };
    try {
        await updateRecord(JSON.stringify(newFee));
    } catch(err) {
        console.log(err);
        return null;
    }

    return newFee;
}

module.exports = keepAccounts;