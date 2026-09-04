const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Bhojpuri clip is 12s long, 29 words — sample how many words are visible at
// even intervals through playback to eyeball the new pacing.
(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        defaultViewport: { width: 1200, height: 800 },
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:5183/#/developers/indic-transcribe', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.audio-play');
    await sleep(600);
    await page.click('.audio-play');

    for (let i = 0; i < 8; i += 1) {
        await sleep(1500);
        const s = await page.evaluate(() => ({
            heard: document.querySelectorAll('.tx-word.is-heard').length,
            total: document.querySelectorAll('.tx-word').length,
            t: document.querySelector('.audio-time')?.textContent,
        }));
        console.log(JSON.stringify(s));
    }
    await browser.close();
})();
