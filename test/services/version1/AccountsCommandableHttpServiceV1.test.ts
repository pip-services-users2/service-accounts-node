const restify = require('restify');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { AccountV1 } from '../../../src/data/version1/AccountV1';
import { AccountsMemoryPersistence } from '../../../src/persistence/AccountsMemoryPersistence';
import { AccountsController } from '../../../src/logic/AccountsController';
import { AccountsCommandableHttpServiceV1 } from '../../../src/services/version1/AccountsCommandableHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let ACCOUNT1 = new AccountV1('1', 'account1@conceptual.vision', 'Test User 1');
let ACCOUNT2 = new AccountV1('2', 'account2@conceptual.vision', 'Test User 2');
let ACCOUNT3 = new AccountV1('3', 'account3@conceptual.vision', 'Test User 3');

suite('AccountsCommandableHttpServiceV1', ()=> {
    let service: AccountsCommandableHttpServiceV1;

    let rest: any;

    suiteSetup(async () => {
        let persistence = new AccountsMemoryPersistence();
        let controller = new AccountsController();

        service = new AccountsCommandableHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-accounts', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-accounts', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-accounts', 'service', 'commandable-http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });

    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });

    test('CRUD Operations', async () => {
        let account1: AccountV1;

        // Create one account
        let account = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/accounts/create_account',
                {
                    account: ACCOUNT1
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT1.id);
        assert.equal(account.login, ACCOUNT1.login);
        assert.equal(account.name, ACCOUNT1.name);
        assert.isTrue(account.active);

        account1 = account;

        // Create another account
        account = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/accounts/create_account',
                {
                    account: ACCOUNT2
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT2.id);
        assert.equal(account.login, ACCOUNT2.login);
        assert.equal(account.name, ACCOUNT2.name);
        assert.isTrue(account.active);

        // Create yet another quote
        account = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/accounts/create_account',
                {
                    account: ACCOUNT3
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT3.id);
        assert.equal(account.login, ACCOUNT3.login);
        assert.equal(account.name, ACCOUNT3.name);
        assert.isTrue(account.active);

        // Get all accounts
        let page  = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/accounts/get_accounts',
                {
                    filter: {}
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        // Update the account
        account1.name = 'Updated User 1';

        account = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/accounts/update_account',
                {
                    account: account1
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(account);
        assert.equal(account.id, account1.id)
        assert.equal(account.name, 'Updated User 1');
        assert.equal(account.login, account1.login);

        // Delete account
        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/accounts/delete_account_by_id',
                {
                    account_id: ACCOUNT1.id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Try to get delete account
        account = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/accounts/get_account_by_id',
                {
                    account_id: ACCOUNT1.id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isTrue(account.deleted);
    });
});