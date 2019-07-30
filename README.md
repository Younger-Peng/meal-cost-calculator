# 饭费计算器

省去人工计算的烦恼
![meal-calc](https://s2.ax1x.com/2019/03/25/At6j7d.jpg)

## 启动项目

设置 puppeteer 的下载源，绕过GFW
```sh
npm config set puppeteer_download_host=https://npm.taobao.org/mirrors
```

```sh
npm install
```

```sh
npm start
```

## 注意事项

使用前，请将本项目中涉及到的微信联系人，按照 `bank.json` 中的名字重新设置备注

为了服务持续运行，本地启动后，不要让计算机进入睡眠状态，当然，最好可以部署至云服务器？

![always_on_line](https://s2.ax1x.com/2019/03/25/AtcR8P.png)

## 充值
如果您想充值，直接在 "前端小分队" 里回复 `+100`，即可充值到账。当然，这只是数字上的。

## 消费
如果您想扣款，直接在 "前端小分队" 里回复 `-16`，即可从您的账户扣除 `16`。


## TodoList

- [x] 数据同步的问题：存储至 `LeanCloud`
- [ ] 存储失败没有提供回滚机制
- [x] 提醒机制：吃了饭忘了扣钱