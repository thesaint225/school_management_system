import { chromium } from '@playwright/test';

async function registerStudentVisually() {
  console.log('🖥️ Launching VISIBLE browser window on your desktop screen...');
  
  // Launch visible browser with slowMo so user can easily watch every action
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000, // 1000ms delay between actions for visual clarity
    args: ['--start-maximized', '--window-size=1280,900']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 }
  });
  
  const page = await context.newPage();

  console.log('🌐 Opening EduManage Staging Website at http://localhost:5500/index.html ...');
  await page.goto('http://localhost:5500/index.html', { waitUntil: 'networkidle' });

  // 1. Click "Enroll Student" in the navigation
  console.log('👆 Navigating to "Enroll Student" section...');
  await page.click('a[data-nav="enrollment"]');
  await page.waitForTimeout(1000);

  // 2. Generate unique test student info
  const timestamp = Date.now();
  const studentName = 'Esi Sutherland';
  const studentEmail = `esi.sutherland.${timestamp}@edumanage.edu`;

  console.log(`✍️ Filling Student Information for: ${studentName}...`);
  await page.fill('#studentName', studentName);
  await page.selectOption('#studentGender', 'Female');
  await page.fill('#studentDob', '2010-09-12');
  await page.fill('#studentEmail', studentEmail);
  await page.fill('#studentPhone', '+233 24 777 8899');

  // 3. Select Class Level
  console.log('🏫 Selecting class: Form 1...');
  await page.waitForSelector('#studentClass option:not([disabled])', { state: 'attached' });
  await page.selectOption('#studentClass', { value: 'Form 1' });
  await page.fill('#yearOfEnrollment', '2026');

  // 4. Select Subjects
  console.log('📚 Selecting enrolled subjects (Mathematics, Integrated Science, ICT)...');
  await page.waitForSelector('input[name="subjects"]', { state: 'attached' });
  const mathBox = page.locator('input[name="subjects"][value="Mathematics"]');
  const sciBox = page.locator('input[name="subjects"][value="Integrated Science"]');
  const ictBox = page.locator('input[name="subjects"][value="ICT"]');

  if (await mathBox.count() > 0) await mathBox.check();
  if (await sciBox.count() > 0) await sciBox.check();
  if (await ictBox.count() > 0) await ictBox.check();

  // 5. Fill Fee & Guardian Details
  console.log('👨‍👩‍👧 Filling Guardian & Fee details...');
  await page.selectOption('#feesStatus', 'Paid');
  await page.fill('#guardianName', 'Dr. Kofi Sutherland');
  await page.selectOption('#guardianRelation', 'Father');
  await page.fill('#guardianPhone', '+233 20 555 4321');

  // 6. Submit the Registration Form
  console.log('💾 Submitting the registration form...');
  await page.click('#studentRegistrationForm button[type="submit"]');

  // 7. Wait for Success Feedback Banner
  const feedback = page.locator('#studentFormFeedback');
  await feedback.waitFor({ state: 'visible', timeout: 10000 });
  const feedbackText = await feedback.textContent();
  console.log(`📢 Success Notification: "${feedbackText}"`);

  await page.waitForTimeout(2000);

  // 8. Navigate to Students directory to show the newly created card
  console.log('🔍 Navigating to Students Directory to display the new student card...');
  await page.click('a[data-nav="students"]');
  
  const showStudentsBtn = page.locator('#showStudentsBtn');
  if (await showStudentsBtn.isVisible()) {
    const btnText = await showStudentsBtn.textContent();
    if (btnText && btnText.includes('Show')) {
      await showStudentsBtn.click();
    }
  }

  const studentCard = page.locator(`.student-card:has-text("${studentName}")`);
  await studentCard.first().waitFor({ state: 'visible', timeout: 8000 });
  
  // Scroll student card into view and highlight it
  await studentCard.first().scrollIntoViewIfNeeded();
  await studentCard.first().evaluate((el) => {
    el.style.border = '3px solid #3b82f6';
    el.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
  });

  console.log(`🎉 "${studentName}" is now registered and highlighted on your screen!`);
  
  // Keep browser open for a few seconds for visual verification
  await page.waitForTimeout(5000);
  await browser.close();
  console.log('✅ Browser closed successfully.');
}

registerStudentVisually().catch((err) => {
  console.error('❌ Error during visual browser registration:', err);
  process.exit(1);
});
