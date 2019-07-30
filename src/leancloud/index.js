const AV = require('leancloud-storage')
const APP_ID = 'your_app_id'
const APP_KEY = 'your_app_key'

if (APP_ID === 'your_app_id' || APP_KEY === 'your_app_key') {
    throw new Error('请先在 leancloud 注册应用，获取 appid 和 appkey\n')
    process.exit(-1)
}

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
})

async function keepAccounts(name, money) {
    await addCost(name, money);
    const oldSum = await getSum()
    const newSum = calcNewSum(oldSum, name, money)
    await updateSum(newSum)
    return newSum
}

function calcNewSum(oldSum, name, money) {
    let cash = oldSum.get('cash')
    let total = oldSum.get('total')
    const consumer = cash.find(item => item.name === name)
    if (consumer) {
        consumer.total = round(consumer.total + money, 2);
    } else {
        cash.push({ name, total: money })
    }
    return { cash, total }
}

function getSum() {
    const objectId = '5d3fa610ba39c80068f358a8'
    const sum = new AV.Query('Sum')
    return sum.get(objectId);
}

function addCost(name, money) {
    const Cost = AV.Object.extend('Cost')
    const cost = new Cost()
    cost.set('name', name)
    cost.set('fee', money)
    return cost.save()
}

function updateSum(sum) {
    const objectId = '5d3fa610ba39c80068f358a8'

    var newSum = AV.Object.createWithoutData('Sum', objectId);
    newSum.set('cash', sum.cash);

    newSum.set('total', sum.total)
    return newSum.save()
}

function round(number, precision) {
    return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
}

function getDailyCost() {
    const today = new Date().toISOString().substr(0, 10) + ' 00:00:00';
    const query = new AV.Query('Cost');
    query.greaterThan('createdAt', new Date(today))
    return query.find().then(costs => costs.map(cost => cost.attributes))
}

module.exports = {
    keepAccounts,
    getDailyCost
}


// 更新原始数据
// ;(function injectStartUpData() {
//     updateSum({
//         "cash" : [
//         {
//             "name" : "彭扬", 
//             "total" : 85.6
//         }, 
//         {
//             "name" : "李金刚", 
//             "total" : 40
//         }, 
//         {
//             "name" : "冯连帅", 
//             "total" : 64.2
//         }, 
//         {
//             "name" : "张芳", 
//             "total" : 136.8
//         }, 
//         {
//             "name" : "王正正", 
//             "total" : 88.8
//         }, 
//         {
//             "name" : "刘尧尧", 
//             "total" : 51.5
//         }, 
//         {
//             "name" : "王安琪", 
//             "total" : 34
//         }
//     ], 
//     "total" : 500.9
//     }).then(console.log)
//     .catch(console.log)
// })();