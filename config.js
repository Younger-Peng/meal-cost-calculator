const webGroup = {
    roomName: '前端小分队',
    jsonFile: require('path').join(__dirname, 'bank.json')
};

const fullStack = {
    roomName: '全干工程师',
    jsonFile: require('path').join(__dirname, 'fullStack.json')
}

const mealFeeGroup = {
    roomName: '饭费计算器',
    jsonFile: require('path').join(__dirname, 'mealFee.json')
}

module.exports = webGroup;
// module.exports = fullStack;
// module.exports = mealFeeGroup;