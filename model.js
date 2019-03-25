//  Todo
// 本地存储有同步的问题，考虑将数据存储至 LeanCloud

const AV = require('leancloud-storage');
const APP_ID = '5XXHU8WKS0V1Lg8javKxOheK-gzGzoHsz';
const APP_KEY = '5G4ysUDLWgW03jRGyyEf7oak';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

new AV.Query('MealCost')
    .get('5c9871cd42cda600723dd8d3')
    .then(mealCost => {
        console.log(mealCost.toJSON());
        mealCost.set('pengyang', 1000000)
        mealCost.save().then(
            success => {
                console.log(success)
            },
            err => {
                console.log(err)
            }
        )
    }, err => {
        console.log(err)
    })
