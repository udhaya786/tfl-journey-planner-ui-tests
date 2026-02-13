import { Given, When, Then } from '@cucumber/cucumber';
import { expect, request } from '@playwright/test';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';


// ---------------------------
// Global variables
// ---------------------------

let apiContext: any;
let response: any;
let responseBody: any;
let responseTime: number;
let identifiers: string;

const baseURL: string = 'https://openlibrary.org/api/books';


// ---------------------------
// GIVEN STEPS
// ---------------------------

Given('the OpenLibrary Books API is available', async function () {

  // Create Playwright API context
  apiContext = await request.newContext();

});


Given('I have valid book identifiers {string}', function (ids: string) {

  identifiers = ids;

});


// ---------------------------
// WHEN STEP
// ---------------------------

When(
  'I send a GET request to the OpenLibrary Books API for those identifiers',
  async function () {

    const endpoint =
      `${baseURL}?bibkeys=${identifiers}&format=json`;

    // Start timer
    const startTime = Date.now();

    // Send request
    response = await apiContext.get(endpoint);

    // Calculate response time
    responseTime = Date.now() - startTime;

    // Parse response body
    responseBody = await response.json();

  }
);


// ---------------------------
// THEN STEPS
// ---------------------------

Then(
  'the response code should be {int}',
  function (expectedStatus: number) {

    expect(response.status()).toBe(expectedStatus);

  }
);


Then(
  'the response time should be less than {int} milliseconds',
  function (maxTime: number) {

    expect(responseTime).toBeLessThan(maxTime);

  }
);


Then(
  'the number of returned books should be {int}',
  function (expectedCount: number) {

    const actualCount = Object.keys(responseBody).length;

    expect(actualCount).toBe(expectedCount);

  }
);


Then(
  'the response should contain correct details for each requested identifier',
  function () {

    const requestedKeys = identifiers.split(',');

    requestedKeys.forEach((key) => {

      expect(responseBody[key]).toBeDefined();

      expect(responseBody[key].bib_key).toBe(key);

      expect(responseBody[key].info_url)
        .toContain('openlibrary.org');

    });

  }
);


Then(
  'each returned book should include a thumbnail image URL',
  function () {

    Object.values(responseBody).forEach((book: any) => {

      expect(book.thumbnail_url).toBeTruthy();

      expect(book.thumbnail_url)
        .toContain('covers.openlibrary.org');

    });

  }
);


Then(
  'the thumbnail images should match the stored baseline images in the repository',
  async function () {

    for (const key of Object.keys(responseBody)) {

      const thumbnailUrl =
        responseBody[key].thumbnail_url;

      // Download thumbnail image
      const imageResponse = await axios.get(
        thumbnailUrl,
        {
          responseType: 'arraybuffer'
        }
      );

      expect(imageResponse.status).toBe(200);

      // Convert API image to buffer
      const apiImageBuffer =
        Buffer.from(imageResponse.data);

      // Generate API image hash
      const apiHash = crypto
        .createHash('md5')
        .update(apiImageBuffer)
        .digest('hex');

      // Build baseline image path
      const imageFileName =
        key.replace(':', '_') + '.jpg';

      const baselinePath = path.join(
        process.cwd(),
        'api',
        'baseline-images',
        imageFileName
      );

      // Verify baseline exists
      expect(
        fs.existsSync(baselinePath)
      ).toBeTruthy();

      // Read baseline image
      const baselineBuffer =
        fs.readFileSync(baselinePath);

      // Generate baseline hash
      const baselineHash = crypto
        .createHash('md5')
        .update(baselineBuffer)
        .digest('hex');

      // Compare hashes
      expect(apiHash).toBe(baselineHash);

    }

  }
);
