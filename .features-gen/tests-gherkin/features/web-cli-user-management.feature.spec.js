// Generated from: tests-gherkin/features/web-cli-user-management.feature
import { test } from "playwright-bdd";

test.describe('Web CLI User Management', () => {

  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the web CLI page', null, { page }); 
    await And('the command input is focused', null, { page }); 
  });
  
  test('Add a new user via web CLI', { tag: ['@web'] }, async ({ When, Then, And, page }) => { 
    await When('I enter the command "add-user test-user-web"', null, { page }); 
    await And('I click the Execute button', null, { page }); 
    await Then('I should see "User created successfully" in the output', null, { page }); 
    await And('I should see a profile ID in the output', null, { page }); 
  });

  test('List users after adding one', { tag: ['@web'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I have added a user with handle "test-user-list-web"', null, { page }); 
    await When('I enter the command "list-users"', null, { page }); 
    await And('I click the Execute button', null, { page }); 
    await Then('I should see "test-user-list-web" in the output', null, { page }); 
    await And('I should see "User Profiles:" in the output', null, { page }); 
  });

  test('View user details via web CLI', { tag: ['@web'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I have added a user with handle "test-user-details-web"', null, { page }); 
    await When('I enter the command "user-details" with that user\'s profile ID', null, { page }); 
    await And('I click the Execute button', null, { page }); 
    await Then('I should see "User Profile Details:" in the output', null, { page }); 
    await And('I should see a profile ID in the output', null, { page }); 
    await And('I should see "test-user-details-web" in the output', null, { page }); 
  });

  test('Remove a user via web CLI', { tag: ['@web'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I have added a user with handle "test-user-remove-web"', null, { page }); 
    await When('I enter the command "remove-user" with that user\'s profile ID', null, { page }); 
    await And('I click the Execute button', null, { page }); 
    await Then('I should see "User removed successfully" in the output', null, { page }); 
    await When('I enter the command "list-users"', null, { page }); 
    await And('I click the Execute button', null, { page }); 
    await Then('I should not see "test-user-remove-web" in the output', null, { page }); 
  });

  test('User persistence across page refresh', { tag: ['@web'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I have added a user with handle "test-user-persist-web"', null, { page }); 
    await When('I refresh the page', null, { page }); 
    await And('I enter the command "list-users"', null, { page }); 
    await And('I click the Execute button', null, { page }); 
    await Then('I should see "test-user-persist-web" in the output', null, { page }); 
  });

  test('Export user data as JSON', { tag: ['@web'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I have added a user with handle "test-user-export"', null, { page }); 
    await When('I click the "Download JSON" button', null, { page }); 
    await Then('a JSON file should be downloaded', null, { page }); 
    await And('the JSON file should contain the user data', null, { page }); 
    await And('the downloaded JSON file should have the correct format', null, { page }); 
  });

  test('Import user data from JSON', { tag: ['@web'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I have a JSON file with user data'); 
    await When('I click the "Upload JSON" button', null, { page }); 
    await And('I select the JSON file', null, { page }); 
    await Then('I should see "JSON imported successfully" in the output', null, { page }); 
    await And('the imported user should appear in the user list', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-gherkin/features/web-cli-user-management.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":11,"tags":["@web"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the web CLI page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the command input is focused","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I enter the command \"add-user test-user-web\"","stepMatchArguments":[{"group":{"start":20,"value":"\"add-user test-user-web\"","children":[{"start":21,"value":"add-user test-user-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"And I click the Execute button","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then I should see \"User created successfully\" in the output","stepMatchArguments":[{"group":{"start":13,"value":"\"User created successfully\"","children":[{"start":14,"value":"User created successfully","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And I should see a profile ID in the output","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":17,"tags":["@web"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the web CLI page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the command input is focused","isBg":true,"stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":18,"keywordType":"Context","textWithKeyword":"Given I have added a user with handle \"test-user-list-web\"","stepMatchArguments":[{"group":{"start":32,"value":"\"test-user-list-web\"","children":[{"start":33,"value":"test-user-list-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I enter the command \"list-users\"","stepMatchArguments":[{"group":{"start":20,"value":"\"list-users\"","children":[{"start":21,"value":"list-users","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"And I click the Execute button","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Then I should see \"test-user-list-web\" in the output","stepMatchArguments":[{"group":{"start":13,"value":"\"test-user-list-web\"","children":[{"start":14,"value":"test-user-list-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"And I should see \"User Profiles:\" in the output","stepMatchArguments":[{"group":{"start":13,"value":"\"User Profiles:\"","children":[{"start":14,"value":"User Profiles:","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":26,"pickleLine":24,"tags":["@web"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the web CLI page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the command input is focused","isBg":true,"stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"Given I have added a user with handle \"test-user-details-web\"","stepMatchArguments":[{"group":{"start":32,"value":"\"test-user-details-web\"","children":[{"start":33,"value":"test-user-details-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When I enter the command \"user-details\" with that user's profile ID","stepMatchArguments":[{"group":{"start":20,"value":"\"user-details\"","children":[{"start":21,"value":"user-details","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"And I click the Execute button","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Then I should see \"User Profile Details:\" in the output","stepMatchArguments":[{"group":{"start":13,"value":"\"User Profile Details:\"","children":[{"start":14,"value":"User Profile Details:","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":31,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"And I should see a profile ID in the output","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"And I should see \"test-user-details-web\" in the output","stepMatchArguments":[{"group":{"start":13,"value":"\"test-user-details-web\"","children":[{"start":14,"value":"test-user-details-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":35,"pickleLine":32,"tags":["@web"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the web CLI page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the command input is focused","isBg":true,"stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":33,"keywordType":"Context","textWithKeyword":"Given I have added a user with handle \"test-user-remove-web\"","stepMatchArguments":[{"group":{"start":32,"value":"\"test-user-remove-web\"","children":[{"start":33,"value":"test-user-remove-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":37,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"When I enter the command \"remove-user\" with that user's profile ID","stepMatchArguments":[{"group":{"start":20,"value":"\"remove-user\"","children":[{"start":21,"value":"remove-user","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":38,"gherkinStepLine":35,"keywordType":"Action","textWithKeyword":"And I click the Execute button","stepMatchArguments":[]},{"pwStepLine":39,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"Then I should see \"User removed successfully\" in the output","stepMatchArguments":[{"group":{"start":13,"value":"\"User removed successfully\"","children":[{"start":14,"value":"User removed successfully","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":40,"gherkinStepLine":37,"keywordType":"Action","textWithKeyword":"When I enter the command \"list-users\"","stepMatchArguments":[{"group":{"start":20,"value":"\"list-users\"","children":[{"start":21,"value":"list-users","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"And I click the Execute button","stepMatchArguments":[]},{"pwStepLine":42,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then I should not see \"test-user-remove-web\" in the output","stepMatchArguments":[{"group":{"start":17,"value":"\"test-user-remove-web\"","children":[{"start":18,"value":"test-user-remove-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":45,"pickleLine":41,"tags":["@web"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the web CLI page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the command input is focused","isBg":true,"stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":42,"keywordType":"Context","textWithKeyword":"Given I have added a user with handle \"test-user-persist-web\"","stepMatchArguments":[{"group":{"start":32,"value":"\"test-user-persist-web\"","children":[{"start":33,"value":"test-user-persist-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":47,"gherkinStepLine":43,"keywordType":"Action","textWithKeyword":"When I refresh the page","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":44,"keywordType":"Action","textWithKeyword":"And I enter the command \"list-users\"","stepMatchArguments":[{"group":{"start":20,"value":"\"list-users\"","children":[{"start":21,"value":"list-users","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":49,"gherkinStepLine":45,"keywordType":"Action","textWithKeyword":"And I click the Execute button","stepMatchArguments":[]},{"pwStepLine":50,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"Then I should see \"test-user-persist-web\" in the output","stepMatchArguments":[{"group":{"start":13,"value":"\"test-user-persist-web\"","children":[{"start":14,"value":"test-user-persist-web","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":53,"pickleLine":48,"tags":["@web"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the web CLI page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the command input is focused","isBg":true,"stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":49,"keywordType":"Context","textWithKeyword":"Given I have added a user with handle \"test-user-export\"","stepMatchArguments":[{"group":{"start":32,"value":"\"test-user-export\"","children":[{"start":33,"value":"test-user-export","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":55,"gherkinStepLine":50,"keywordType":"Action","textWithKeyword":"When I click the \"Download JSON\" button","stepMatchArguments":[{"group":{"start":12,"value":"\"Download JSON\"","children":[{"start":13,"value":"Download JSON","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":56,"gherkinStepLine":51,"keywordType":"Outcome","textWithKeyword":"Then a JSON file should be downloaded","stepMatchArguments":[]},{"pwStepLine":57,"gherkinStepLine":52,"keywordType":"Outcome","textWithKeyword":"And the JSON file should contain the user data","stepMatchArguments":[]},{"pwStepLine":58,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"And the downloaded JSON file should have the correct format","stepMatchArguments":[]}]},
  {"pwTestLine":61,"pickleLine":55,"tags":["@web"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the web CLI page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And the command input is focused","isBg":true,"stepMatchArguments":[]},{"pwStepLine":62,"gherkinStepLine":56,"keywordType":"Context","textWithKeyword":"Given I have a JSON file with user data","stepMatchArguments":[]},{"pwStepLine":63,"gherkinStepLine":57,"keywordType":"Action","textWithKeyword":"When I click the \"Upload JSON\" button","stepMatchArguments":[{"group":{"start":12,"value":"\"Upload JSON\"","children":[{"start":13,"value":"Upload JSON","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":64,"gherkinStepLine":58,"keywordType":"Action","textWithKeyword":"And I select the JSON file","stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":59,"keywordType":"Outcome","textWithKeyword":"Then I should see \"JSON imported successfully\" in the output","stepMatchArguments":[{"group":{"start":13,"value":"\"JSON imported successfully\"","children":[{"start":14,"value":"JSON imported successfully","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":66,"gherkinStepLine":60,"keywordType":"Outcome","textWithKeyword":"And the imported user should appear in the user list","stepMatchArguments":[]}]},
]; // bdd-data-end