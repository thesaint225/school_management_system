import { test, expect } from '@playwright/test';

test.describe('Student Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    // Open staging page
    await page.goto('/index.html');
    // Ensure the page is loaded
    await expect(page).toHaveTitle(/EduManage/);
  });

  test('should successfully register a new student and persist to database', async ({ page }) => {
    // 1. Navigate to "Enroll Student" form section
    const enrollNavBtn = page.locator('a[data-nav="enrollment"]');
    await enrollNavBtn.click();

    const formSection = page.locator('#studentFormSection');
    await expect(formSection).toBeVisible();

    // 2. Fill out Student Information
    const uniqueEmail = `abena.test.${Date.now()}@edumanage.edu`;
    const testStudentName = 'Abena Mensah';

    await page.fill('#studentName', testStudentName);
    await page.selectOption('#studentGender', 'Female');
    await page.fill('#studentDob', '2010-06-15');
    await page.fill('#studentEmail', uniqueEmail);
    await page.fill('#studentPhone', '+233 24 999 8888');

    // 3. Select an available class from the dynamic dropdown
    await page.waitForSelector('#studentClass option:not([disabled])', { state: 'attached' });
    await page.selectOption('#studentClass', { value: 'Form 1' });

    await page.fill('#yearOfEnrollment', '2026');

    // 4. Select Enrolled Subjects
    await page.waitForSelector('input[name="subjects"]', { state: 'attached' });
    const firstSubjectCheckbox = page.locator('input[name="subjects"]').first();
    await firstSubjectCheckbox.check();

    // 4. Fill Fee & Guardian Details
    await page.selectOption('#feesStatus', 'Paid');
    await page.fill('#guardianName', 'Mr. Kwame Mensah');
    await page.selectOption('#guardianRelation', 'Father');
    await page.fill('#guardianPhone', '+233 20 111 2222');

    // 5. Submit the registration form
    const submitBtn = page.locator('#studentRegistrationForm button[type="submit"]');
    await submitBtn.click();

    // 6. Verify feedback banner indicates success
    const feedback = page.locator('#studentFormFeedback');
    await expect(feedback).toBeVisible({ timeout: 10000 });
    await expect(feedback).toContainText('Successfully registered Abena Mensah');

    // 7. Verify the student appears in the Students directory roster
    const studentsNavBtn = page.locator('a[data-nav="students"]');
    await studentsNavBtn.click();

    const showStudentsBtn = page.locator('#showStudentsBtn');
    if (await showStudentsBtn.isVisible()) {
      await showStudentsBtn.click();
    }

    const studentCard = page.locator(`.student-card:has-text("${testStudentName}")`);
    await expect(studentCard.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display validation feedback when required fields are empty', async ({ page }) => {
    // Navigate to form
    await page.locator('a[data-nav="enrollment"]').click();

    // Trigger blur on empty student name
    const nameInput = page.locator('#studentName');
    await nameInput.focus();
    await nameInput.blur();

    const errorName = page.locator('#errorStudentName');
    await expect(errorName).toBeVisible();
    await expect(errorName).toContainText('Please enter the student\'s full legal name');
    await expect(nameInput).toHaveClass(/is-invalid/);
  });
});
