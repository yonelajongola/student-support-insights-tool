const { chromium } = require('playwright');
const { mkdir } = require('node:fs/promises');
const path = require('node:path');

const frontendRoot = process.cwd();
const projectRoot = path.resolve(frontendRoot, '..');
const outputDir = path.join(projectRoot, 'evidence', 'Testing', 'screenshots');
const invalidCsv = path.join(projectRoot, 'evidence', 'Testing', 'invalid_upload.csv');
const baseUrl = 'http://localhost:3000';

function panel(page, title) {
  return page.locator('section.panel').filter({ has: page.locator('h2', { hasText: title }) }).first();
}

(async () => {
  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  async function createPage() {
    const context = await browser.newContext({ viewport: { width: 1440, height: 2200 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.locator('h1').waitFor({ state: 'visible' });
    return { context, page };
  }

  async function screenshotDashboardOverview() {
    const { context, page } = await createPage();
    const dashboardSection = panel(page, 'Dashboard');
    await dashboardSection.scrollIntoViewIfNeeded();
    const box = await dashboardSection.boundingBox();
    const clipHeight = Math.min(2100, Math.ceil((box?.y || 0) + (box?.height || 0) + 40));
    await page.screenshot({ path: path.join(outputDir, 'dashboard-overview.png'), clip: { x: 0, y: 0, width: 1440, height: clipHeight } });
    await context.close();
  }

  async function screenshotRiskTable() {
    const { context, page } = await createPage();
    const riskSection = panel(page, 'High-Risk Learner Table');
    await riskSection.scrollIntoViewIfNeeded();
    await riskSection.screenshot({ path: path.join(outputDir, 'risk-table.png') });
    await context.close();
  }

  async function screenshotUploadValidation() {
    const { context, page } = await createPage();
    await page.locator('#csvFile').setInputFiles(invalidCsv);
    const validation = page.locator('.validation-panel');
    await validation.waitFor({ state: 'visible', timeout: 15000 });
    const dataInput = panel(page, 'Data Input');
    await dataInput.scrollIntoViewIfNeeded();
    await dataInput.screenshot({ path: path.join(outputDir, 'upload-validation.png') });
    await context.close();
  }

  async function screenshotManualValidation() {
    const { context, page } = await createPage();
    await panel(page, 'Data Input').scrollIntoViewIfNeeded();
    await page.getByLabel('Learner ID').fill('L');
    await page.getByLabel('Province').fill('W');
    await page.locator('input[type="number"]').nth(0).fill('0');
    await page.locator('input[type="number"]').nth(1).fill('0');
    await page.locator('input[type="number"]').nth(2).fill('0');
    await page.getByLabel('Employment status').fill('');
    await page.getByLabel('Support need').fill('');
    await page.getByRole('button', { name: 'Add Learner' }).click();
    await page.locator('.field-error').first().waitFor({ state: 'visible' });
    await page.locator('form.form-shell').screenshot({ path: path.join(outputDir, 'manual-form-validation.png') });
    await context.close();
  }

  async function screenshotRecommendationsAndEthics() {
    const { context, page } = await createPage();
    const recommendations = panel(page, 'Recommendations');
    const ethics = panel(page, 'Ethics And Privacy Panel');
    await recommendations.scrollIntoViewIfNeeded();
    const top = await recommendations.boundingBox();
    const bottom = await ethics.boundingBox();
    const clipTop = Math.max(0, Math.floor((top?.y || 0) - 20));
    const clipHeight = Math.min(2100, Math.ceil(((bottom?.y || 0) + (bottom?.height || 0) - clipTop) + 20));
    await page.screenshot({ path: path.join(outputDir, 'recommendations-ethics.png'), clip: { x: 0, y: clipTop, width: 1440, height: clipHeight } });
    await context.close();
  }

  try {
    await screenshotDashboardOverview();
    await screenshotRiskTable();
    await screenshotUploadValidation();
    await screenshotManualValidation();
    await screenshotRecommendationsAndEthics();
  } finally {
    await browser.close();
  }
})();
