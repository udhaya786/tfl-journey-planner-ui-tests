// tests/plan-journey.spec.ts
import { test } from '@playwright/test';
import { PlanJourneyPage } from '../pages/plan-journey.page';

test.describe('TfL plan a journey from widget', () => {
  test('plan a journey and edit preferences', async ({ page }) => {
    const journey = new PlanJourneyPage(page);

    await journey.open();
    await journey.acceptCookies();

    await journey.setFromViaAutocomplete('lei', 'Leicester Square Underground');
    await journey.setToViaAutocomplete('cov', 'Covent Garden Underground');
    await journey.setTime('0915');
    await journey.planJourney();

    await journey.openWalkingAndCyclingSection();
    await journey.expectWalkingAndCyclingVisible();

    await journey.openEditPreferences();
    await journey.chooseLeastWalkingMinutes('10');
    await journey.saveUpdatedJourney();
    await journey.expectUpdatedJourneyApplied();

    // View access info details 
    await journey.openFirstOptionDetails();
    await journey.expectCoventGardenAccessInfoVisible();
    await journey.hideDetails();
  });

  test('cannot plan a journey when no locations are entered', async ({ page }) => {
    const journey = new PlanJourneyPage(page);

    await journey.open();
    await journey.acceptCookies();

    await journey.submitEmptyJourney();
    await journey.expectRequiredErrorsForEmptyJourney();
  });

  test('does not provide results for an invalid journey', async ({ page }) => {
    const journey = new PlanJourneyPage(page);

  await journey.open();
  await journey.acceptCookies();

  // use shorter clearly-invalid strings to avoid odd parsing/redirects
  await journey.submitInvalidJourney('34', '45');

  await journey.expectInvalidJourneyError();
  });
});
