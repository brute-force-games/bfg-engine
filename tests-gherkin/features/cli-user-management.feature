@cli
Feature: CLI User Management
  As a user
  I want to manage user profiles via the CLI
  So that I can create, list, view, and remove users

  Background:
    Given the CLI is available
    And the user store is clean

  Scenario: Add a new user via CLI
    When I add a user with handle "test-user-cli"
    Then the user should be created successfully
    And the user should have a profile ID
    And the user should appear in the user list

  Scenario: List all users
    Given a user exists with handle "test-user-list-1"
    And another user exists with handle "test-user-list-2"
    When I list all users
    Then I should see exactly 2 users
    And I should see the user "test-user-list-1" in the list
    And I should see the user "test-user-list-2" in the list

  Scenario: View user details
    Given a user exists with handle "test-user-details"
    When I view the details for that user
    Then I should see the user's profile ID
    And I should see the user's handle
    And I should see the user's creation timestamp

  Scenario: Remove a user
    Given a user exists with handle "test-user-remove"
    And another user exists with handle "test-user-do-not-remove"
    When I remove the user with handle "test-user-remove"
    Then the user should not appear in the user list

  Scenario: User persistence across sessions
    Given a user exists with handle "test-user-persist"
    When I check the store
    Then I should see user "test-user-persist" appeared in the store
