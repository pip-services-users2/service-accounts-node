const assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { AccountV1 } from '../../src/data/version1/AccountV1';
import { AccountsMemoryPersistence } from '../../src/persistence/AccountsMemoryPersistence';
import { AccountsController } from '../../src/logic/AccountsController';

let ACCOUNT1 = new AccountV1('1', 'user1@conceptual.vision', 'Test User 1');
let ACCOUNT2 = new AccountV1('2', 'user2@conceptual.vision', 'Test User 2');

suite('AccountsController', ()=> {    
    let persistence: AccountsMemoryPersistence;
    let controller: AccountsController;

    setup(() => {
        persistence = new AccountsMemoryPersistence();

        controller = new AccountsController();
        controller.configure(ConfigParams.fromTuples(
            'options.login_as_email', true
        ));

        let references: References = References.fromTuples(
            new Descriptor('service-accounts', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-accounts', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
    
    test('Create New User', async () => {
        let account = await controller.createAccount(
            null,
            ACCOUNT1
        );

        assert.isObject(account);
        assert.equal(account.name, ACCOUNT1.name);
        assert.equal(account.login, ACCOUNT1.login);
    });

    test('Fail to Create Account with the Same Email', async () => {
        // Sign up
        let account = await controller.createAccount(
            null,
            ACCOUNT1
        );

        assert.isObject(account);

        // Try to sign up again
        let err = null;
        try {
            await controller.createAccount(
                null,
                ACCOUNT1
            );
        } catch (e) {
            err = e;
            // pass
        }

        assert.isNotNull(err);
    });

    test('Get Accounts', async () => {
        let account1, account2;

        // Create account #1
        account1 = await controller.createAccount(null, ACCOUNT1);

        assert.isObject(account1);

        // Create account #2
        account2 = await controller.createAccount(null, ACCOUNT2);

        assert.isObject(account2);

        // Get a single account
        let account = await controller.getAccountById(null, account1.id);

        assert.isObject(account);
        assert.equal(account.id, account1.id);
        assert.equal(account.login, account1.login);

        // Find account by email
        account = await controller.getAccountByIdOrLogin(null, account2.login);

        assert.isObject(account);
        assert.equal(account.id, account2.id);
        assert.equal(account.login, account2.login);

        // Get all accounts
        let page = await controller.getAccounts(
            null,
            new FilterParams(),
            new PagingParams(),
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 2);
    });

    test('Update Account', async () => {
        let account1;

        // Sign up
        let account = await controller.createAccount(null, ACCOUNT1);

        assert.isObject(account);
        account1 = account;

        // Update account
        account1.name = 'New Name';
        account = await controller.updateAccount(null, account1);

        assert.isObject(account);
        assert.equal(account.name, "New Name");
    });

    test('Change Account Email', async () => {
        let account1;

        // Sign up
        let account = await controller.createAccount(null, ACCOUNT1);

        assert.isObject(account);
        account1 = account;

        // Change account email
        account1.login = 'test@test.com';
        account1.name = 'New Test Name';

        account = await controller.updateAccount(null, account1);

        assert.isObject(account);
        assert.equal(account.login, 'test@test.com');
        assert.equal(account.name, 'New Test Name');
    });
    
});