// Generated from: tests-gherkin/features/cli-user-management.feature
import { test } from "playwright-bdd";

test.describe('CLI User Management', () => {

  test.beforeEach('Background', async ({ Given, And }, testInfo) => { if (testInfo.error) return;
    await Given('the CLI is available'); 
    await And('the user database is clean'); 
  });
  
  test('Add a new user via CLI', { tag: ['@cli'] }, async ({ When, Then, And }) => { 
    await When('I add a user with handle "test-user-cli"'); 
    await Then('the user should be created successfully'); 
    await And('the user should have a profile ID'); 
    await And('the user should appear in the user list'); 
  });

  test('List all users', { tag: ['@cli'] }, async ({ Given, When, Then, And }) => { 
    await Given('a user exists with handle "test-user-list"'); 
    await When('I list all users'); 
    await Then('I should see the user "test-user-list" in the list'); 
    await And('the list should show profile IDs'); 
  });

  test('View user details', { tag: ['@cli'] }, async ({ Given, When, Then, And }) => { 
    await Given('a user exists with handle "test-user-details"'); 
    await When('I view the details for that user'); 
    await Then('I should see the user\'s profile ID'); 
    await And('I should see the user\'s handle'); 
    await And('I should see the user\'s creation timestamp'); 
  });

  test('Remove a user', { tag: ['@cli'] }, async ({ Given, When, Then, And }) => { 
    await Given('a user exists with handle "test-user-remove"'); 
    await When('I remove that user'); 
    await Then('the user should be removed successfully'); 
    await And('the user should not appear in the user list'); 
  });

  test('User persistence across sessions', { tag: ['@cli'] }, async ({ Given, When, Then, And }) => { 
    await Given('a user exists with handle "test-user-persist"'); 
    await When('I check the JSON file'); 
    await Then('the user should be stored in the JSON file'); 
    await And('the JSON file should have the correct format'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-gherkin/features/cli-user-management.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":11,"tags":["@cli"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given the CLI is available","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the user database is clean","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I add a user with handle \"test-user-cli\"","stepMatchArguments":[{"group":{"start":25,"value":"\"test-user-cli\"","children":[{"start":26,"value":"test-user-cli","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then the user should be created successfully","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the user should have a profile ID","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the user should appear in the user list","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":17,"tags":["@cli"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given the CLI is available","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the user database is clean","isBg":true,"stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":18,"keywordType":"Context","textWithKeyword":"Given a user exists with handle \"test-user-list\"","stepMatchArguments":[{"group":{"start":26,"value":"\"test-user-list\"","children":[{"start":27,"value":"test-user-list","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I list all users","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then I should see the user \"test-user-list\" in the list","stepMatchArguments":[{"group":{"start":22,"value":"\"test-user-list\"","children":[{"start":23,"value":"test-user-list","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And the list should show profile IDs","stepMatchArguments":[]}]},
  {"pwTestLine":25,"pickleLine":23,"tags":["@cli"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given the CLI is available","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the user database is clean","isBg":true,"stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Given a user exists with handle \"test-user-details\"","stepMatchArguments":[{"group":{"start":26,"value":"\"test-user-details\"","children":[{"start":27,"value":"test-user-details","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When I view the details for that user","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then I should see the user's profile ID","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And I should see the user's handle","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"And I should see the user's creation timestamp","stepMatchArguments":[]}]},
  {"pwTestLine":33,"pickleLine":30,"tags":["@cli"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given the CLI is available","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the user database is clean","isBg":true,"stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":31,"keywordType":"Context","textWithKeyword":"Given a user exists with handle \"test-user-remove\"","stepMatchArguments":[{"group":{"start":26,"value":"\"test-user-remove\"","children":[{"start":27,"value":"test-user-remove","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"When I remove that user","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"Then the user should be removed successfully","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"And the user should not appear in the user list","stepMatchArguments":[]}]},
  {"pwTestLine":40,"pickleLine":36,"tags":["@cli"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given the CLI is available","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the user database is clean","isBg":true,"stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":37,"keywordType":"Context","textWithKeyword":"Given a user exists with handle \"test-user-persist\"","stepMatchArguments":[{"group":{"start":26,"value":"\"test-user-persist\"","children":[{"start":27,"value":"test-user-persist","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":42,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When I check the JSON file","stepMatchArguments":[]},{"pwStepLine":43,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then the user should be stored in the JSON file","stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"And the JSON file should have the correct format","stepMatchArguments":[]}]},
]; // bdd-data-end