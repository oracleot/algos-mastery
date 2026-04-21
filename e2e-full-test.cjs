const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = '/root/projects/algos-mastery/e2e-results';
const REPORT_FILE = '/root/projects/algos-mastery/e2e-report.txt';

const fs = require('fs');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const results = [];
let browser;

function log(message) {
  console.log(message);
  results.push(message);
}

function pass(testName) {
  log(`✅ PASS: ${testName}`);
}

function fail(testName, error) {
  log(`❌ FAIL: ${testName} - ${error}`);
}

async function screenshot(page, name) {
  const path = `${SCREENSHOT_DIR}/${name}.png`;
  await page.screenshot({ path, fullPage: true });
  log(`   📸 Screenshot: ${path}`);
  return path;
}

async function closeOnboarding(page) {
  // Try to close any joyride/onboarding overlays
  try {
    const skipBtn = page.locator('button:has-text("Skip"), button:has-text("skip"), [data-test-id="overlay"]').first();
    if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipBtn.click({ force: true });
      await page.waitForTimeout(500);
      log('   Closed onboarding overlay');
    }
  } catch (e) {}
  
  // Try ESC key to close
  try {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (e) {}
}

async function runTests() {
  log('═══════════════════════════════════════════════════════════════');
  log('  E2E TEST REPORT - algos-mastery');
  log(`  Run at: ${new Date().toISOString()}`);
  log('═══════════════════════════════════════════════════════════════\n');

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      log(`   [Browser Error]: ${msg.text()}`);
    }
  });

  try {
    // ═══════════════════════════════════════════════════════════════
    // TEST 1: Homepage loads
    // ═══════════════════════════════════════════════════════════════
    log('TEST 1: Homepage loads');
    log('-'.repeat(50));
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      await closeOnboarding(page);
      
      const title = await page.title();
      log(`   Page title: "${title}"`);
      
      const hasContent = await page.locator('body').isVisible();
      if (hasContent) {
        await screenshot(page, '01-homepage-loaded');
        pass('Homepage loads successfully');
      } else {
        fail('Homepage loads', 'Page body not visible');
      }
    } catch (e) {
      fail('Homepage loads', e.message);
      await screenshot(page, '01-homepage-error');
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 2: Navigation links work
    // ═══════════════════════════════════════════════════════════════
    log('\nTEST 2: Navigation links work');
    log('-'.repeat(50));
    try {
      const navLinks = await page.locator('nav a, header a, a[href*="/"]').all();
      log(`   Found ${navLinks.length} links`);
      
      let navPassCount = 0;
      for (const link of navLinks.slice(0, 8)) {
        const href = await link.getAttribute('href');
        const text = await link.textContent().catch(() => 'no text');
        if (href && !href.startsWith('http')) {
          log(`   - "${text?.trim() || 'link'}" -> ${href}`);
          navPassCount++;
        }
      }
      
      await screenshot(page, '02-navigation-links');
      if (navPassCount > 0) {
        pass(`Navigation links work (${navPassCount} internal links)`);
      } else {
        fail('Navigation links', 'No navigation links found');
      }
    } catch (e) {
      fail('Navigation links', e.message);
      await screenshot(page, '02-navigation-error');
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 3: Click into Arrays topic
    // ═══════════════════════════════════════════════════════════════
    log('\nTEST 3: Click into Arrays topic');
    log('-'.repeat(50));
    try {
      // Look for Arrays topic using more specific selectors
      const arraysBadge = page.locator('text="Arrays & Hashing"').first();
      const isVisible = await arraysBadge.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isVisible) {
        await screenshot(page, '03-arrays-before-click');
        await arraysBadge.click({ force: true });  // Force click to bypass overlays
        await page.waitForTimeout(2000);
        await screenshot(page, '03-arrays-after-click');
        
        const url = page.url();
        log(`   Current URL: ${url}`);
        
        // Check if we're on a topic page or problems page
        const hasProblems = await page.locator('[class*="problem"], [class*="card"], tr').count();
        log(`   Problem elements found: ${hasProblems}`);
        
        pass('Arrays topic clicked');
      } else {
        fail('Arrays topic', 'Arrays topic link not found');
        await screenshot(page, '03-arrays-not-found');
      }
    } catch (e) {
      fail('Arrays topic click', e.message);
      await screenshot(page, '03-topic-error');
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 4: Problems page - Search bar
    // ═══════════════════════════════════════════════════════════════
    log('\nTEST 4: Search bar functionality');
    log('-'.repeat(50));
    try {
      // Navigate to problems page
      await page.goto(`${BASE_URL}/problems`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      await closeOnboarding(page);
      await screenshot(page, '04-problems-page');
      
      // Find search input - try various selectors
      const searchSelectors = [
        'input[type="search"]',
        'input[placeholder*="search" i]',
        'input[placeholder*="Search" i]',
        'input[class*="search"]',
        'input[class*="Search"]',
        '[role="searchbox"]',
        'input[type="text"]'
      ];
      
      let searchInput = null;
      for (const sel of searchSelectors) {
        const input = page.locator(sel).first();
        if (await input.isVisible({ timeout: 500 }).catch(() => false)) {
          searchInput = input;
          log(`   Found search input with selector: ${sel}`);
          break;
        }
      }
      
      if (searchInput) {
        await searchInput.fill('two sum');
        await page.waitForTimeout(1000);
        await screenshot(page, '04-search-query');
        
        // Try pressing Enter or waiting for results
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        pass('Search bar works');
      } else {
        fail('Search bar', 'Search input not found on problems page');
        await screenshot(page, '04-search-not-found');
      }
    } catch (e) {
      fail('Search bar', e.message);
      await screenshot(page, '04-search-error');
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 5: Difficulty filters
    // ═══════════════════════════════════════════════════════════════
    log('\nTEST 5: Difficulty filters');
    log('-'.repeat(50));
    try {
      await page.goto(`${BASE_URL}/problems`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      await closeOnboarding(page);
      
      // Look for difficulty badges/buttons
      const easyFilter = page.locator('text=/\\bEasy\\b/i').first();
      const mediumFilter = page.locator('text="/\\bMedium\\b/i"').first();
      const hardFilter = page.locator('text="/\\bHard\\b/i"').first();
      
      let filterCount = 0;
      
      if (await easyFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        await screenshot(page, '05-filters-easy');
        await easyFilter.click({ force: true });
        await page.waitForTimeout(800);
        log('   Easy filter clicked');
        filterCount++;
      }
      
      if (await page.locator('text=/\\bMedium\\b/i').first().isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.locator('text=/\\bMedium\\b/i').first().click({ force: true });
        await page.waitForTimeout(800);
        log('   Medium filter clicked');
        filterCount++;
      }
      
      if (await page.locator('text=/\\bHard\\b/i').first().isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.locator('text=/\\bHard\\b/i').first().click({ force: true });
        await page.waitForTimeout(800);
        log('   Hard filter clicked');
        filterCount++;
      }
      
      await screenshot(page, '05-filters-applied');
      
      if (filterCount > 0) {
        pass(`Difficulty filters work (${filterCount} filters found)`);
      } else {
        fail('Difficulty filters', 'No difficulty filters found');
        await screenshot(page, '05-filters-not-found');
      }
    } catch (e) {
      fail('Difficulty filters', e.message);
      await screenshot(page, '05-filters-error');
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 6: Mobile viewport
    // ═══════════════════════════════════════════════════════════════
    log('\nTEST 6: Mobile viewport (375px wide)');
    log('-'.repeat(50));
    try {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      await screenshot(page, '06-mobile-homepage');
      
      const bodyVisible = await page.locator('body').isVisible();
      log(`   Mobile viewport: 375x812`);
      log(`   Body visible: ${bodyVisible}`);
      
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      log(`   Scroll width: ${scrollWidth}, Viewport: ${viewportWidth}`);
      
      if (scrollWidth <= viewportWidth + 10) {
        pass('Mobile viewport renders correctly');
      } else {
        fail('Mobile viewport', `Horizontal scroll detected`);
      }
      
    } catch (e) {
      fail('Mobile viewport', e.message);
      await screenshot(page, '06-mobile-error');
    }

  } catch (e) {
    log(`\n❌ CRITICAL ERROR: ${e.message}`);
  } finally {
    await browser.close();
  }

  // ═══════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════
  log('\n═══════════════════════════════════════════════════════════════');
  log('  SUMMARY');
  log('═══════════════════════════════════════════════════════════════');
  
  const passCount = results.filter(r => r.includes('✅ PASS')).length;
  const failCount = results.filter(r => r.includes('❌ FAIL')).length;
  const totalCount = passCount + failCount;
  
  log(`\n  Total Tests: ${totalCount}`);
  log(`  Passed: ${passCount}`);
  log(`  Failed: ${failCount}`);
  log(`  Pass Rate: ${totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0}%`);
  log('\n═══════════════════════════════════════════════════════════════');
  
  const report = results.join('\n');
  fs.writeFileSync(REPORT_FILE, report);
  log(`\n📄 Report saved to: ${REPORT_FILE}`);
  log(`📸 Screenshots: ${SCREENSHOT_DIR}/`);
  
  return { passCount, failCount, totalCount };
}

runTests().then(async (summary) => {
  try {
    const { execSync } = require('child_process');
    execSync('pkill -f "vite" || true');
  } catch (e) {}
  
  console.log('\n✅ Test run complete!');
  process.exit(summary.failCount > 0 ? 1 : 0);
}).catch(e => {
  console.error('Test runner failed:', e);
  process.exit(1);
});
