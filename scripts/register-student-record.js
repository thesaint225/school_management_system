import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function registerStudentVisuallyWithRecording() {
  const recordingsDir = path.resolve('./recordings');
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  console.log('🖥️ Launching VISIBLE browser window on your desktop screen...');
  console.log('🎥 Recording video to: ./recordings ...');

  // Launch visible browser with slowMo so user can easily watch every action
  const browser = await chromium.launch({
    headless: false,
    slowMo: 900, // 900ms delay between actions for smooth visual playback
    args: ['--start-maximized', '--window-size=1280,900']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1280, height: 850 }
    }
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
  const studentName = 'Kwabena Darko';
  const studentEmail = `kwabena.darko.${timestamp}@edumanage.edu`;

  console.log(`✍️ Filling Student Information for: ${studentName}...`);
  await page.fill('#studentName', studentName);
  await page.selectOption('#studentGender', 'Male');
  await page.fill('#studentDob', '2010-03-25');
  await page.fill('#studentEmail', studentEmail);
  await page.fill('#studentPhone', '+233 24 333 4455');

  // 3. Select Class Level
  console.log('🏫 Selecting class: Form 1...');
  await page.waitForSelector('#studentClass option:not([disabled])', { state: 'attached' });
  await page.selectOption('#studentClass', { value: 'Form 1' });
  await page.fill('#yearOfEnrollment', '2026');

  // 4. Select Subjects
  console.log('📚 Selecting enrolled subjects (Mathematics, English, ICT)...');
  await page.waitForSelector('input[name="subjects"]', { state: 'attached' });
  const mathBox = page.locator('input[name="subjects"][value="Mathematics"]');
  const engBox = page.locator('input[name="subjects"][value="English"]');
  const ictBox = page.locator('input[name="subjects"][value="ICT"]');

  if (await mathBox.count() > 0) await mathBox.check();
  if (await engBox.count() > 0) await engBox.check();
  if (await ictBox.count() > 0) await ictBox.check();

  // 5. Fill Fee & Guardian Details
  console.log('👨‍👩‍👧 Filling Guardian & Fee details...');
  await page.selectOption('#feesStatus', 'Paid');
  await page.fill('#guardianName', 'Mr. Yaw Darko');
  await page.selectOption('#guardianRelation', 'Father');
  await page.fill('#guardianPhone', '+233 20 777 6655');

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
    el.style.border = '3px solid #22c55e';
    el.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.6)';
  });

  console.log(`🎉 "${studentName}" is now registered and highlighted!`);

  // Wait a few seconds so the final state is captured on video
  await page.waitForTimeout(4000);

  // Close page and context to finalize video writing
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (video) {
    const videoPath = await video.path();
    console.log(`🎬 Video recording saved to: ${videoPath}`);
  }

  console.log('✅ Visual browser session & video recording completed successfully.');
}

registerStudentVisuallyWithRecording().catch((err) => {
  console.error('❌ Error during visual browser registration:', err);
  process.exit(1);
});
