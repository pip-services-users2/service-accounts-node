const assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { AccountV1 } from '../../src/data/version1/AccountV1';
import { IAccountsPersistence } from '../../src/persistence/IAccountsPersistence';

let ACCOUNT1 = new AccountV1('1', 'user1@conceptual.vision', 'Test User 1');
let ACCOUNT2 = new AccountV1('2', 'user2@conceptual.vision', 'Test User 2');
let ACCOUNT3 = new AccountV1('3', 'user3@conceptual.vision', 'Test User 3');

export class AccountsPersistenceFixture {
    private _persistence: IAccountsPersistence;
    
    constructor(persistence: IAccountsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private async createAccounts() {
        // Create one account
        let account = await this._persistence.create(null, ACCOUNT1);

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT1.id);
        assert.equal(account.login, ACCOUNT1.login);
        assert.equal(account.name, ACCOUNT1.name);
        assert.isTrue(account.active);


        // Create another account
        account = await this._persistence.create(null, ACCOUNT2);

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT2.id);
        assert.equal(account.login, ACCOUNT2.login);
        assert.equal(account.name, ACCOUNT2.name);
        assert.isTrue(account.active);

        // Create yet another account
        account = await this._persistence.create(null, ACCOUNT3);

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT3.id);
        assert.equal(account.login, ACCOUNT3.login);
        assert.equal(account.name, ACCOUNT3.name);
        assert.isTrue(account.active);

    }
                
    public async testCrudOperations() {
        let account1;

        // Create items
        await this.createAccounts();

        // Get all account
        let page = await this._persistence.getPageByFilter(
            null,
            new FilterParams(),
            new PagingParams()
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        account1 = page.data[0];

        // Update the account
        account1.name = 'Updated User 1';

        let account = await this._persistence.update(null, account1);

        assert.isObject(account);
        assert.equal(account.id, account1.id)
        assert.equal(account.name, 'Updated User 1');
        assert.equal(account.login, account1.login);

        // Delete account
        await this._persistence.deleteById(null, ACCOUNT1.id);

        // Try to get deleted account
        account = await this._persistence.getOneById(null, ACCOUNT1.id);

        assert.isNull(account || null);

    }

    public async testGetWithFilter() {
        // Create accounts
        await this.createAccounts();

        // Get account filtered by active
        let page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromValue({
                active: true,
                search: 'user'
            }),
            new PagingParams()
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        // Get account by email
        let account = await this._persistence.getOneByLogin(null, ACCOUNT2.login);

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT2.id);

        // Get account by id or email
        account = await this._persistence.getOneByIdOrLogin(null, ACCOUNT3.login);

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT3.id);
    }
}
