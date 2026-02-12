# Tfl Journey Planner Widget UI test (Playwright+Typescript)
This project provides UI test automation for the public **Transport for London (Tfl) "Plan a journey"** widget
The tests are implemented using **Playwright Test** with **Typescript** and follow a **Page Object Model (POM)** design

## Tech Stake
-Node.js and
-Playwright Test ('@playwright/test)
-TypeScript

## Project Structure
-'pages.plan-journey.page.ts'
Define the Page Object Module for the Tfl journey planner widget, including locators and resuable actions

-'tests/plan-journey.spec.ts'
Contains the UI automated test scenario's, including
-Valid journey flow (enter locations, edit preferences, view journey details).
-Validation behaviour when no locations are entered.
-Validation behaviour when an invalid journey is submitted

## Getting Started

From the project root:

'''bash
# Install project dependencies
npm install

# Install playwright browsers ( first time only)
npx plywright install

## Running the Test

# Run the full test suite in headless mode
npx playwright test

# Run the test in headed mode (with browser UI)
npx playwright test --headed

# Run only the Tfl journey planner spec
npx playwright test tests,plan-journey.spec.ts

## HTML Test Report
After a test run, you can open the Playwright HTML report with
npx playwright show-report

