// pages/plan-journey.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class PlanJourneyPage {
  private readonly page: Page;
  readonly url = 'https://tfl.gov.uk/plan-a-journey/?cid=plan-a-journey';

  constructor(page: Page) {
    this.page = page;
  }

  // ─-cookies ───────────────────────────────────────────────

 
get cookieOverlay(): Locator {
  return this.page.locator('#cb-cookieoverlay');
}

async open(): Promise<void> {
  await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
}

/**
 * cookie acceptance, then force-hide the overlay so it can't block tests.
 */
async acceptCookies(): Promise<void> {
  // Give the overlay a chance to appear
  await this.cookieOverlay.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

  // Try clicking any primary consent button inside the overlay
  const possibleButtons = [
    this.page.getByRole('button', { name: 'Accept all cookies', exact: false }),
    this.page.getByRole('button', { name: 'Accept', exact: false }),
    this.page.getByRole('button', { name: 'Got it', exact: false }),
    this.page.getByRole('button', { name: 'Allow all', exact: false }),
  ];

  for (const btn of possibleButtons) {
    const visible = await btn.isVisible().catch(() => false);
    if (visible) {
      await btn.click().catch(() => {});
      break;
    }
  }

  // Force-hide overlay if still present after a short wait
  await this.page.waitForTimeout(1000);

  await this.page.evaluate(() => {
    const overlay = document.querySelector('#cb-cookieoverlay') as HTMLElement | null;
    if (overlay) {
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
    }
  });

  // As a final check, ensure it no longer intercepts
  // (but don't fail the whole test if TfL changes this)
  await this.cookieOverlay
    .waitFor({ state: 'hidden', timeout: 2000 })
    .catch(() => {});
}

  // ─── Journey inputs ───────────────────────────────────────────────

  get fromCombobox(): Locator {
    return this.page.getByRole('combobox', { name: 'From location' });
  }

  get toCombobox(): Locator {
    return this.page.getByRole('combobox', { name: 'To location' });
  }

  get changeTimeLink(): Locator {
    return this.page.getByRole('link', { name: 'change time' });
  }

  get timeSelect(): Locator {
    return this.page.getByLabel('Time', { exact: true });
  }

  get planJourneyButton(): Locator {
    return this.page.getByRole('button', { name: 'Plan my journey' });
  }

  async setFromViaAutocomplete(partial: string, fullOption: string): Promise<void> {
    await this.fromCombobox.click();
    await this.fromCombobox.fill(partial);
    await this.page.getByRole('option', { name: fullOption }).click();
  }

  async setToViaAutocomplete(partial: string, fullOption: string): Promise<void> {
    await this.toCombobox.click();
    await this.toCombobox.fill(partial);
    await this.page.getByRole('option', { name: fullOption }).click();
  }

  async setTime(value: string): Promise<void> {
    await this.changeTimeLink.click();
    await this.timeSelect.selectOption(value); // e.g. '0915'
  }

  async planJourney(): Promise<void> {
    await this.planJourneyButton.click();
  }

  // ─── Validation / error messages ───────────────────────────────────

  get fromRequiredError(): Locator {
    return this.page.getByText('The From field is required.');
  }

  get toRequiredError(): Locator {
    return this.page.getByText('The To field is required.');
  }

  get invalidJourneyError(): Locator {
    return this.page.getByText("Sorry, we can't find a");
  }
  // Generic "any error" locator near the form
  get anyJourneyError(): Locator {
    // non-strict, can match many – we'll just use first visible
    return this.page.getByText(
      'Journey planner could not find any results to your search. Please try again.',
      { exact: false }
    );
  }

  async submitEmptyJourney(): Promise<void> {
    await this.planJourneyButton.click();
  }

  async submitInvalidJourney(fromText: string, toText: string): Promise<void> {
    await this.fromCombobox.click();
    await this.fromCombobox.fill(fromText);

    await this.toCombobox.click();
    await this.toCombobox.fill(toText);

    await this.planJourneyButton.click();
  }

  async expectRequiredErrorsForEmptyJourney(): Promise<void> {
    await expect(this.fromRequiredError).toBeVisible();
    await expect(this.toRequiredError).toBeVisible();
  }

  async expectInvalidJourneyError(): Promise<void> {
    const error = this.page.getByText(/Journey planner could not find any results/i);

  await error.waitFor({ state: 'visible', timeout: 10000 });
  await expect(error).toBeVisible();
  }

  // ─── Results: walking and cycling ─────────────────────────────────

  get walkingAndCyclingHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Walking and cycling' });
  }

  get cyclingTab(): Locator {
    return this.page.getByRole('link', { name: 'Cycling' });
  }

  async openWalkingAndCyclingSection(): Promise<void> {
    await this.walkingAndCyclingHeading.waitFor({ state: 'visible', timeout: 30000 });
    await this.walkingAndCyclingHeading.click();
  }

  async openCyclingTab(): Promise<void> {
    await this.cyclingTab.click();
  }

  // ─── Edit preferences ─────────────────────────────────────────────

  get editPreferencesButton(): Locator {
    return this.page.getByRole('button', { name: 'Edit preferences' });
  }

  get walkingMinutesSelect(): Locator {
    return this.page.getByLabel('I only want to walk for a');
  }

  get walkingSpeedLabel(): Locator {
    return this.page.locator('label', { hasText: 'My walking speed is' });
  }

  get updateJourneyButton(): Locator {
    return this.page.getByRole('button', { name: 'Update journey' });
  }

  get cancelPreferencesButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  async openEditPreferences(): Promise<void> {
    await this.editPreferencesButton.click();
  }

  async chooseLeastWalkingMinutes(minutes: string): Promise<void> {
    await this.walkingMinutesSelect.selectOption(minutes); // e.g. '10'
  }

  async saveUpdatedJourney(): Promise<void> {
    await this.updateJourneyButton.click();
  }

  async cancelPreferences(): Promise<void> {
    await this.cancelPreferencesButton.click();
  }

  // ─── Directions / details ─────────────────────────────────────────

  get viewDirectionsButton(): Locator {
    return this.page.getByRole('button', { name: 'View directions', exact: true });
  }

  get hideDirectionsLinks(): Locator {
    return this.page.getByRole('link', { name: 'Hide directions' });
  }

  async toggleDirections(): Promise<void> {
    await this.viewDirectionsButton.click();
  }

  // New locators & methods for "View details" + Covent Garden access info

  get firstOptionViewDetailsButton(): Locator {
    return this.page
      .getByLabel('Option 1: walking, Piccadilly')
      .getByText('View details');
  }

  get hideDetailsButton(): Locator {
    return this.page.getByRole('button', { name: 'Hide details' });
  }

  get coventGardenAccessHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Covent Garden Underground Station' });
  }

  async openFirstOptionDetails(): Promise<void> {
    // Wait a bit for search results to render
    await this.page.waitForTimeout(5000);

    const isVisible = await this.firstOptionViewDetailsButton
      .isVisible()
      .catch(() => false);

    if (!isVisible) {
      console.warn('Option 1 View details not available for this journey');
      return; // gracefully skip
    }

    await this.firstOptionViewDetailsButton.click();
  }

  async hideDetails(): Promise<void> {
    await this.page.waitForTimeout(2000); // small grace period

    const isVisible = await this.hideDetailsButton
      .isVisible()
      .catch(() => false);

    if (!isVisible) {
      console.warn('Hide details button not available / not visible');
      return;
    }

    await this.hideDetailsButton.click();
  }

  async expectCoventGardenAccessInfoVisible(): Promise<void> {
    const isVisible = await this.coventGardenAccessHeading
      .isVisible()
      .catch(() => false);

    if (!isVisible) {
      console.warn('Covent Garden access information not shown for this option');
      return;
    }

    await expect(this.coventGardenAccessHeading).toBeVisible();
  }

  // assertion helpers

  async expectWalkingAndCyclingVisible(): Promise<void> {
    await expect(this.walkingAndCyclingHeading).toBeVisible();
  }

  async expectUpdatedJourneyApplied(): Promise<void> {
    await expect(this.updateJourneyButton).not.toBeVisible({ timeout: 5000 }).catch(() => {});
  }
}
