const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const coll = ['cost', 'sum']
const dbName = 'mealfee';
const dbs = {};

const config = {
    useNewUrlParser: true
};

const client = new MongoClient(url, config);

function time() {
    return new Date().toISOString();
}

function connect() {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) {
                reject(err);
            } else {
                console.log('connected to mongo')
                dbs.mealfee = client.db(dbName);
                resolve();
            }
        })
    });
}

module.exports = {
    connect,
    dbs
}