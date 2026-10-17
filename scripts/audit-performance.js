import { chromium } from '@playwright/test';
import fs from 'fs';

async function auditPerformance() {
  console.log('🔍 Starting Comprehensive Browser Performance Audit...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Attach CDP Session for Chrome DevTools Performance metrics
  const client = await context.newCDPSession(page);
  await client.send('Performance.enable');

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

  const url = 'http://localhost:5500/index.html';
  console.log(`🌐 Navigating to ${url}...`);

  const startTime = Date.now();
  await page.goto(url, { waitUntil: 'networkidle' });
  const totalLoadTimeMs = Date.now() - startTime;

  // Extract Web Vitals & Navigation Timings from the live browser DOM
  const performanceData = await page.evaluate(async () => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    const fcp = fcpEntry ? fcpEntry.startTime : null;

    // Measure Largest Contentful Paint (LCP)
    const lcp = await new Promise((resolve) => {
      let lcpValue = null;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          lcpValue = entries[entries.length - 1].startTime;
        }
      });
      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {}
      setTimeout(() => resolve(lcpValue || fcp || 0), 1000);
    });

    // Measure Cumulative Layout Shift (CLS)
    const cls = await new Promise((resolve) => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });
      try {
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}
      setTimeout(() => resolve(clsValue), 1000);
    });

    // Resource metrics
    const resources = performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      initiatorType: r.initiatorType,
      duration: r.duration,
      transferSize: r.transferSize,
      decodedBodySize: r.decodedBodySize
    }));

    // DOM & Memory metrics
    const domElementCount = document.querySelectorAll('*').length;
    const memory = performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    } : null;

    return {
      navigation: {
        ttfb: nav.responseStart - nav.requestStart,
        domInteractive: nav.domInteractive,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadEventEnd: nav.loadEventEnd - nav.startTime,
        transferSize: nav.transferSize,
        encodedBodySize: nav.encodedBodySize,
        decodedBodySize: nav.decodedBodySize
      },
      vitals: {
        fcp,
        lcp,
        cls
      },
      domElementCount,
      memory,
      resources
    };
  });

  // CDP Performance Metrics
  const cdpMetrics = await client.send('Performance.getMetrics');
  const cdpMap = {};
  for (const m of cdpMetrics.metrics) {
    cdpMap[m.name] = m.value;
  }

  // Measure Section Transition Speeds
  console.log('⚡ Measuring view switching & section interaction latencies...');
  const viewTimings = {};
  
  const sections = [
    { nav: 'students', selector: '#studentsSection', name: 'Students Directory' },
    { nav: 'teachers', selector: '#teachersSection', name: 'Teachers Directory' },
    { nav: 'classes', selector: '#classesSection', name: 'Classes & Rosters' },
    { nav: 'subjects', selector: '#subjectsSection', name: 'Subjects Curriculum' },
    { nav: 'enrollment', selector: '#studentFormSection', name: 'Enrollment Form' }
  ];

  for (const sec of sections) {
    const t0 = Date.now();
    await page.click(`a[data-nav="${sec.nav}"]`);
    await page.waitForSelector(sec.selector, { state: 'visible' });
    viewTimings[sec.name] = Date.now() - t0;
    await page.waitForTimeout(200);
  }

  await browser.close();

  const auditResults = {
    totalLoadTimeMs,
    performanceData,
    cdpMap,
    viewTimings,
    consoleLogs
  };

  fs.writeFileSync('./scripts/audit-results.json', JSON.stringify(auditResults, null, 2));
  console.log('✅ Performance Audit Data Captured Successfully!');
  console.log(JSON.stringify({
    totalLoadTimeMs,
    vitals: performanceData.vitals,
    navigation: performanceData.navigation,
    domElements: performanceData.domElementCount,
    jsHeapUsedMB: performanceData.memory ? (performanceData.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) : 'N/A',
    viewTimings
  }, null, 2));
}

auditPerformance().catch(err => {
  console.error('❌ Error during audit:', err);
  process.exit(1);
});
