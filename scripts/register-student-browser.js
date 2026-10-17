import { chromium } from '@playwright/test';

async function registerStudentThroughBrowser() {
  console.log('🚀 Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log('🌐 Navigating to http://localhost:5500/index.html ...');
  await page.goto('http://localhost:5500/index.html', { waitUntil: 'networkidle' });

  // 1. Click "Enroll Student" in the sidebar
  console.log('👆 Clicking "Enroll Student" navigation button...');
  await page.click('a[data-nav="enrollment"]');

  // 2. Fill out Student Personal Information
  const studentName = 'Akua Konadu';
  const studentEmail = `akua.konadu.${Date.now()}@edumanage.edu`;

  console.log(`✍️ Filling student form for: ${studentName} (${studentEmail})...`);
  await page.fill('#studentName', studentName);
  await page.selectOption('#studentGender', 'Female');
  await page.fill('#studentDob', '2010-08-20');
  await page.fill('#studentEmail', studentEmail);
  await page.fill('#studentPhone', '+233 24 555 7788');

  // 3. Select Class Level
  await page.waitForSelector('#studentClass option:not([disabled])', { state: 'attached' });
  await page.selectOption('#studentClass', { value: 'Form 1' });
  await page.fill('#yearOfEnrollment', '2026');

  // 4. Select Subjects
  await page.waitForSelector('input[name="subjects"]', { state: 'attached' });
  const mathBox = page.locator('input[name="subjects"][value="Mathematics"]');
  const engBox = page.locator('input[name="subjects"][value="English"]');
  const ictBox = page.locator('input[name="subjects"][value="ICT"]');

  if (await mathBox.count() > 0) await mathBox.check();
  if (await engBox.count() > 0) await engBox.check();
  if (await ictBox.count() > 0) await ictBox.check();

  // 5. Fill Fee & Guardian Details
  await page.selectOption('#feesStatus', 'Paid');
  await page.fill('#guardianName', 'Mrs. Grace Konadu');
  await page.selectOption('#guardianRelation', 'Mother');
  await page.fill('#guardianPhone', '+233 20 888 9900');

  // 6. Submit the Registration Form
  console.log('💾 Clicking "Register Student" submit button...');
  await page.click('#studentRegistrationForm button[type="submit"]');

  // 7. Wait for Success Feedback Banner
  const feedback = page.locator('#studentFormFeedback');
  await feedback.waitFor({ state: 'visible', timeout: 10000 });
  const feedbackText = await feedback.textContent();
  console.log(`📢 Server Feedback: "${feedbackText}"`);

  // 8. Verify the student appears in the student directory
  console.log('🔍 Checking student directory roster...');
  await page.click('a[data-nav="students"]');
  const showStudentsBtn = page.locator('#showStudentsBtn');
  if (await showStudentsBtn.isVisible()) {
    const btnText = await showStudentsBtn.textContent();
    if (btnText && btnText.includes('Show')) {
      await showStudentsBtn.click();
    }
  }

  const studentCard = page.locator(`.student-card:has-text("${studentName}")`);
  await studentCard.first().waitFor({ state: 'visible', timeout: 5000 });
  console.log(`✅ Verified: "${studentName}" is now active in the Student Directory cards!`);

  await browser.close();
  console.log('🎉 Browser session completed successfully.');
}

registerStudentThroughBrowser().catch((err) => {
  console.error('❌ Error during browser registration:', err);
  process.exit(1);
});
