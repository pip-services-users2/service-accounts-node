const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';

import { AccountV1 } from '../../src/data/version1/AccountV1';
import { AccountsLambdaFunction } from '../../src/container/AccountsLambdaFunction';

let ACCOUNT1 = new AccountV1('1', 'account1@conceptual.vision', 'Test User 1');
let ACCOUNT2 = new AccountV1('2', 'account2@conceptual.vision', 'Test User 2');
let ACCOUNT3 = new AccountV1('3', 'account3@conceptual.vision', 'Test User 3');

suite('AccountsLambdaFunction', ()=> {
    let lambda: AccountsLambdaFunction;

    suiteSetup(async () => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'service-accounts:persistence:memory:default:1.0',
            'controller.descriptor', 'service-accounts:controller:default:default:1.0'
        );

        lambda = new AccountsLambdaFunction();
        lambda.configure(config);
        await lambda.open(null);
    });
    
    suiteTeardown(async () => {
        await lambda.close(null);
    });
    
    test('CRUD Operations', async () => {
        let account1: AccountV1;

        // Create one account
        let account = await lambda.act(
            {
                role: 'accounts',
                cmd: 'create_account',
                account: ACCOUNT1
            }
        );

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT1.id);
        assert.equal(account.login, ACCOUNT1.login);
        assert.equal(account.name, ACCOUNT1.name);
        assert.isTrue(account.active);

        account1 = account;

        // Create another account
        account = await lambda.act(
            {
                role: 'accounts',
                cmd: 'create_account',
                account: ACCOUNT2
            }
        );

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT2.id);
        assert.equal(account.login, ACCOUNT2.login);
        assert.equal(account.name, ACCOUNT2.name);
        assert.isTrue(account.active);

        // Create yet another quote

        account = await lambda.act(
            {
                role: 'accounts',
                cmd: 'create_account',
                account: ACCOUNT3
            }
        );

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT3.id);
        assert.equal(account.login, ACCOUNT3.login);
        assert.equal(account.name, ACCOUNT3.name);
        assert.isTrue(account.active);

        // Get all accounts
        let page = await lambda.act(
            {
                role: 'accounts',
                cmd: 'get_accounts',
                filter: {}
            }
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        // Update the account
        account1.name = 'Updated User 1';

        account = await lambda.act(
            {
                role: 'accounts',
                cmd: 'update_account',
                account: account1
            }
        );

        assert.isObject(account);
        assert.equal(account.id, account1.id)
        assert.equal(account.name, 'Updated User 1');
        assert.equal(account.login, account1.login);

        // Delete account
        await lambda.act(
            {
                role: 'accounts',
                cmd: 'delete_account_by_id',
                account_id: ACCOUNT1.id
            }
        );

        // Try to get delete account
        account = await lambda.act(
            {
                role: 'accounts',
                cmd: 'get_account_by_id',
                account_id: ACCOUNT1.id
            }
        );

        assert.isTrue(account.deleted);
    });

});