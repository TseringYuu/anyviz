// Optional: npm install --no-save playwright (outside the repository if preferred).
// Set NODE_PATH if Playwright is installed elsewhere; set CHROME_BIN as needed.
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
(async () => {
  const executablePath = process.env.CHROME_BIN || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ viewport: { width: 660, height: 240 }, deviceScaleFactor: 3 });
    fs.mkdirSync(path.join(__dirname, 'charts/png'), { recursive: true });
    for (const name of ['revenue', 'order-value', 'channels', 'regions', 'margin', 'returns']) {
      await page.goto(pathToFileURL(path.join(__dirname, 'charts', name + '.svg')).href);
      await page.screenshot({ path: path.join(__dirname, 'charts/png', name + '.png') });
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
