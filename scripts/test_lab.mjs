import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/fc19471c-61c7-4a2f-b375-c923189a20f3';

async function main() {
  console.log('Starting Virtual Lab test with Microsoft Edge...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const viewports = [
    { name: 'mobile_360x640', width: 360, height: 640 },
    { name: 'mobile_390x844', width: 390, height: 844 },
    { name: 'tablet_768x1024', width: 768, height: 1024 },
    { name: 'desktop_1280x800', width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    // Chem tab
    await page.goto('http://localhost:5173/#/lab?tab=chem', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const hasScrollChem = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(vp.name + ' [Chem] hasHorizontalScroll: ' + hasScrollChem);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'lab_' + vp.name + '_chem.png'),
      fullPage: false,
    });

    // Physics tab
    await page.goto('http://localhost:5173/#/lab?tab=physics', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const hasScrollPhy = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(vp.name + ' [Physics] hasHorizontalScroll: ' + hasScrollPhy);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'lab_' + vp.name + '_physics.png'),
      fullPage: false,
    });

    // Bio tab
    await page.goto('http://localhost:5173/#/lab?tab=bio', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const hasScrollBio = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(vp.name + ' [Bio] hasHorizontalScroll: ' + hasScrollBio);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'lab_' + vp.name + '_bio.png'),
      fullPage: false,
    });

    await page.close();
  }

  await browser.close();
  console.log('All Virtual Lab Playwright multi-viewport tests completed successfully!');
}

main().catch((err) => {
  console.error('Playwright test failed:', err);
  process.exit(1);
});
