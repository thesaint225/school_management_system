import { test, expect } from '@playwright/test';

test.describe('Student Results & Official PDF Report Card Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/EduManage/);
  });

  test('should display Results & Reports nav link and navigate to Results section', async ({ page }) => {
    const resultsNavBtn = page.locator('a[data-nav="results"]');
    await expect(resultsNavBtn).toBeVisible();
    await resultsNavBtn.click();

    const resultsSection = page.locator('#resultsSection');
    await expect(resultsSection).toBeVisible();
    await expect(page.locator('#resultsTitle')).toContainText('Student Results & Report Cards');
  });

  test('should calculate live score total as CA and Exam marks are typed', async ({ page }) => {
    await page.locator('a[data-nav="results"]').click();
    await expect(page.locator('#resultsSection')).toBeVisible();

    const caInput = page.locator('#resultCaScore');
    const examInput = page.locator('#resultExamScore');
    const liveBadge = page.locator('#liveTotalBadge');

    await expect(caInput).toBeVisible();

    // Type CA = 25
    await caInput.fill('25');
    await expect(liveBadge).toContainText('Total: 25.0 / 100');

    // Type Exam = 65
    await examInput.fill('65');
    await expect(liveBadge).toContainText('Total: 90.0 / 100');
    await expect(liveBadge).toHaveClass(/badge-active/);
  });

  test('should display terminal report card for Ama Mensah with correct subjects and average', async ({ page }) => {
    await page.locator('a[data-nav="results"]').click();

    const reportContainer = page.locator('#studentReportCardContainer');
    await expect(reportContainer).toBeVisible({ timeout: 10000 });

    // Verify school and student header
    await expect(reportContainer).toContainText('SPRINGFIELD INTERNATIONAL ACADEMY');
    await expect(reportContainer).toContainText('Ama Mensah');

    // Verify subject rows and average
    await expect(reportContainer).toContainText('Mathematics');
    await expect(reportContainer).toContainText('English');
    await expect(reportContainer).toContainText('Terminal Average Score');
    await expect(reportContainer).toContainText('84.0%');
  });

  test('should download official A4 PDF report card from Results section', async ({ page }) => {
    await page.locator('a[data-nav="results"]').click();
    await expect(page.locator('#resultsSection')).toBeVisible();

    const reportSelect = page.locator('#reportStudentSelect');
    await expect(reportSelect).toBeVisible({ timeout: 10000 });
    
    // Ensure Ama Mensah is selected
    await expect(page.locator('#studentReportCardContainer')).toContainText('SPRINGFIELD INTERNATIONAL ACADEMY', { timeout: 10000 });

    const downloadBtn = page.locator('#downloadReportPdfBtn');
    await expect(downloadBtn).toBeVisible({ timeout: 10000 });

    // Listen for browser download event
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;

    // Verify downloaded filename format
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/report-card-.*\.pdf$/i);
  });

  test('should provide PDF report card download inside Student Profile Modal', async ({ page }) => {
    // Ama Mensah is in the top achiever widget on dashboard
    const amaRow = page.locator('.achiever-row:has-text("Ama Mensah")').first();
    await expect(amaRow).toBeVisible({ timeout: 10000 });
    await amaRow.click();

    const modal = page.locator('#studentModal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('#modalStudentName')).toContainText('Ama Mensah');

    // Verify Download PDF button is present in modal
    const modalPdfBtn = modal.locator('#downloadStudentModalPdfBtn');
    await expect(modalPdfBtn).toBeVisible();

    // Verify download trigger
    const downloadPromise = page.waitForEvent('download');
    await modalPdfBtn.click();
    const download = await downloadPromise;

    const filename = download.suggestedFilename();
    expect(filename).toMatch(/report-card-.*\.pdf$/i);

    // Close modal
    await page.locator('#closeModalBtn').click();
    await expect(modal).not.toHaveClass(/active/);
  });
});
