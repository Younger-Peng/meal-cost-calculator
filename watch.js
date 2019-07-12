// const cost = require('./mealfee.cost.json');
// const fs = require('fs');
// const dateCost = {};
// cost.forEach(record => {
//     const time = record.time.slice(0, 10);
//     if (dateCost[time]) {
//         if (dateCost[time][record.name]) {
//             dateCost[time][record.name] += `, ${record.fee}`
//         } else {
//             dateCost[time][record.name] = `${record.fee}`
//         }
//     } else {
//         dateCost[time] = {
//             [record.name]: record.fee + ''
//         }
//     }
// });

// fs.writeFile('cost.txt', JSON.stringify(dateCost), (err, res) => {
//     console.log(res)
// })


setTimeout(() => {
    console.log('haha')
}, -12 * 1000)