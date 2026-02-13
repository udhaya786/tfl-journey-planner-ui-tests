# Tfl Journey Planner UI test + OpenLibrary API Test 
Automation framework using playwright, TyrpeScript and Cucumber (Gherkin)

## Overview
This repository contains automated tests for

1. ## UI Automation
   Transport for London (TfL) Journey Planner widget, 
   Built using Playwright Test + TypeScript, 
   Uses Page Object Model (POM)

2. ## API Automation
   OpenLibrary Books API, 
   Built using Playwright APIRequestContext + Cucumber + TypeScript, 
   Uses Gherkin syntax for Behaviour Driven Development (BDD), 
   Includes response validation, performance checks, and thumbnail image comparison

## Tech Stake
   Node.js, 
   Playwright Test ('@playwright/test), 
   TypeScript, 
   Playwright APIRequestContext, 
   Cucumber(@cucumber/cucumber), 
   Axio (for image dowmload), 
   Crypto ( for image hash comparison).

## Project Structure
   tfl-journey-planner-ui-tests
│
├── pages/
│   └── plan-journey.page.ts
│
├── tests/
│   └── plan-journey.spec.ts
│
├── api/
│   ├── features/
│   │   └── openLibrary.feature
│   │
│   ├── step-definitions/
│   │   └── openLibrary.steps.ts
│   │
│   └── baseline-images/
│       ├── ISBN_0201558025.jpg
│       ├── LCCN_93005405.jpg
│       └── ISBN_1583762027.jpg
│
├── cucumber.js
├── package.json
└── README.md

## UI Automation Coverage
   tests/plan-journey.spec.ts
Contains the UI automated test scenario's, including
   Valid journey flow (enter locations, edit preferences, view journey details).
   Validation behaviour when no locations are entered.
   Validation behaviour when an invalid journey is submitted

## API Test Coverage
## Functional validation
Response status code = 200
Correct number of returned books
Correct book identifiers returned
Each book contains:
   bib_key
   info_url
   thumbnail_url
## Performance validation
  Response time less than defined threshold (example: 2000ms)

## Image validation
Downloads thumbnail images from API
Compares with stored baseline images
Uses MD5 hash comparison to ensure exact match
    

## Getting Started

From the project root:

'''bash
# Install project dependencies
  npm install

# Install playwright browsers ( first time only)
  npx plywright install

## Running UI Tests

# Run the full test suite in headless mode
  npx playwright test:ui

# Run the test in headed mode (with browser UI)
  npx playwright test --headed

# Run only the Tfl journey planner spec
  npx playwright test tests,plan-journey.spec.ts

## HTML Test Report
   After a test run, you can open the Playwright HTML report with
   npx playwright show-report

## Running API Tests
   npx playwright test:api

=======
# tfl-journey-planner-ui-tests
UI automation tests for the TfL "Plan a journey" widget using Playwright and TypeScript
