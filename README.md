# Tfl Journey Planner UI test + OpenLibrary API Test 
Automation framework using playwright, TyrpeScript and Cucumber (Gherkin)

## Overview
This repository contains automated tests for

1. ## Ui Automation
   Transport for London (TfL) Journey Planner widget
   Built using Playwright Test + TypeScript
   Uses Page Object Model (POM)

2. ## API Automation
   OpenLibrary Books API
   Built using Playwright APIRequestContext + Cucumber + TypeScript
   Uses Gherkin syntax for Behaviour Driven Development (BDD)
   Includes response validation, performance checks, and thumbnail image comparison

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

=======
# tfl-journey-planner-ui-tests
UI automation tests for the TfL "Plan a journey" widget using Playwright and TypeScript
