const puppeteer = require('puppeteer');

async function genImg() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({
        width: 375,
        height: 667
    });
    await page.goto('http://localhost:3000/sum.html');
    await page.screenshot({ path: 'sum.png', fullPage: true });
    await browser.close();
}

genImg()