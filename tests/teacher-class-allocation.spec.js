import { test, expect } from '@playwright/test';

test.describe('Teacher + Subject + Class Allocation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/EduManage/);
  });

  test('should display seeded teacher John Mensah with Mathematics and Form 1A, Form 2A', async ({ page }) => {
    // 1. Navigate to Teachers Directory
    await page.locator('a[data-nav="teachers"]').click();
    const teachersSection = page.locator('#teachersSection');
    await expect(teachersSection).toBeVisible();

    // 2. Find John Mensah card
    const johnCard = page.locator('.teacher-card:has-text("John Mensah")');
    await expect(johnCard).toBeVisible({ timeout: 10000 });

    // 3. Verify card shows subject (Mathematics) and assigned classes (Form 1A, Form 2A)
    await expect(johnCard).toContainText('Mathematics');
    await expect(johnCard).toContainText('Form 1A');

    // 4. Open Profile Modal
    await johnCard.locator('.card-view-btn').click();
    const modal = page.locator('#teacherModal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('#modalTeacherName')).toContainText('John Mensah');

    // 5. Verify modal displays Assigned Teaching Subjects and Assigned Classes
    await expect(modal).toContainText('Assigned Teaching Subjects');
    await expect(modal).toContainText('Mathematics');
    await expect(modal).toContainText('Assigned Classes / Class Allocations');
    await expect(modal).toContainText('Form 1A');
    await expect(modal).toContainText('Form 2A');

    // Close modal
    await page.locator('#closeTeacherModalBtn').click();
    await expect(modal).not.toHaveClass(/active/);
  });

  test('should filter teachers by assigned class', async ({ page }) => {
    await page.locator('a[data-nav="teachers"]').click();

    // Wait for class filter options to load
    const classFilter = page.locator('#teacherClassFilter');
    await page.waitForSelector('#teacherClassFilter option:not([value="All"])', { state: 'attached' });

    // Select "Form 1A"
    await classFilter.selectOption('Form 1A');

    // Verify John Mensah is visible
    const johnCard = page.locator('.teacher-card:has-text("John Mensah")');
    await expect(johnCard).toBeVisible();

    // Verify a teacher not teaching Form 1A (e.g. Kwame Asante who teaches Form 3A, 3B) is not displayed
    const kwameCard = page.locator('.teacher-card:has-text("Kwame Asante")');
    await expect(kwameCard).toBeHidden();
  });

  test('should successfully hire a new teacher with assigned classes and persist', async ({ page }) => {
    // 1. Navigate to "Hire Teacher" form
    await page.locator('a[data-nav="hire-teacher"]').click();
    const formSection = page.locator('#teacherFormSection');
    await expect(formSection).toBeVisible();

    // 2. Fill personal details
    const uniqueEmail = `test.teacher.${Date.now()}@edumanage.edu`;
    const uniqueName = `Samuel TestTeacher`;

    await page.fill('#teacherFirstName', 'Samuel');
    await page.fill('#teacherLastName', 'TestTeacher');
    await page.selectOption('#teacherGender', 'Male');
    await page.fill('#teacherDob', '1987-05-14');
    await page.fill('#teacherEmail', uniqueEmail);
    await page.fill('#teacherPhone', '+233 24 555 7788');

    // 3. Specialization
    await page.selectOption('#teacherDepartment', 'Science & Mathematics');
    await page.fill('#teacherQualification', 'B.Sc. Mathematics & Statistics');
    await page.selectOption('#teacherStatus', 'Full-time');

    // 4. Select Subjects
    await page.waitForSelector('input[name="teacherSubjects"]', { state: 'attached' });
    const mathSub = page.locator('input[name="teacherSubjects"][value="Mathematics"]');
    if (await mathSub.count() > 0) {
      await mathSub.check();
    } else {
      await page.locator('input[name="teacherSubjects"]').first().check();
    }

    // 5. Select Classes
    await page.waitForSelector('input[name="teacherClasses"]', { state: 'attached' });
    const form1AClass = page.locator('input[name="teacherClasses"][value="Form 1A"]');
    if (await form1AClass.count() > 0) {
      await form1AClass.check();
    } else {
      await page.locator('input[name="teacherClasses"]').first().check();
    }

    // 6. Submit
    await page.locator('#teacherRegistrationForm button[type="submit"]').click();

    // 7. Verify feedback
    const feedback = page.locator('#teacherFormFeedback');
    await expect(feedback).toBeVisible({ timeout: 10000 });
    await expect(feedback).toContainText('Successfully registered Samuel TestTeacher');
  });

  test('should display assigned teacher inside the Class Details Modal', async ({ page }) => {
    // 1. Navigate to Classes Section
    await page.locator('a[data-nav="classes"]').click();
    const classesSection = page.locator('#classesSection');
    await expect(classesSection).toBeVisible();

    // 2. Click on Form 1A class card
    const form1ACard = page.locator('.class-card:has-text("Form 1A")').first();
    await expect(form1ACard).toBeVisible({ timeout: 10000 });
    await form1ACard.locator('.card-view-btn').click();

    // 3. Verify Class Modal opens
    const modal = page.locator('#classModal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('#modalClassName')).toContainText('Form 1A');

    // 4. Verify John Mensah is listed under Assigned Faculty & Subject Teachers
    await expect(modal).toContainText('Assigned Faculty & Subject Teachers');
    await expect(modal).toContainText('John Mensah');
  });
});
