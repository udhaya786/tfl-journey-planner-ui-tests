Feature: OpenLibrary Books ApI validations

Background:
    Given the OpenLibrary Books API is available
    And I have valid book identifiers "ISBN:0201558025,LCCN:93005405,ISBN:1583762027"

  Scenario: Successful GET request returns correct book details and thumbnails
    When I send a GET request to the OpenLibrary Books API for those identifiers
    Then the response code should be 200
    And the response time should be less than 2000 milliseconds
    And the number of returned books should be 3
    And the response should contain correct details for each requested identifier
    And each returned book should include a thumbnail image URL
    And the thumbnail images should match the stored baseline images in the repository

  Scenario: Request with invalid book identifiers reaturns empty results
   Given the OpenLibrary Books API is available
   And I have valid book identifiers "INVALID:1234567"
   When I send a GET request to the OpenLibrary Books API for those identifiers
   Then the response code should be 200
   And the number of returned books should be 0  

  Scenario: Request with mixed valid and invalid identifiers returns only valid results
   Given the OpenLibrary Books API is available
   And I have valid book identifiers "ISBN:0201558025,INVALID:999999"
   When I send a GET request to the OpenLibrary Books API for those identifiers
   Then the response code should be 200
   And the number of returned books should be 1  


