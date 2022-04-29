const assert = require('chai').assert;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

import { Descriptor } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { AccountV1 } from '../../../src/data/version1/AccountV1';
import { AccountsMemoryPersistence } from '../../../src/persistence/AccountsMemoryPersistence';
import { AccountsController } from '../../../src/logic/AccountsController';
import { AccountsGrpcServiceV1 } from '../../../src/services/version1/AccountsGrpcServiceV1';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let ACCOUNT1 = new AccountV1('1', 'account1@conceptual.vision', 'Test User 1');
let ACCOUNT2 = new AccountV1('2', 'account2@conceptual.vision', 'Test User 2');
let ACCOUNT3 = new AccountV1('3', 'account3@conceptual.vision', 'Test User 3');

suite('AccountsGrpcServiceV1', ()=> {
    let service: AccountsGrpcServiceV1;

    let client: any;

    suiteSetup(async () => {
        let persistence = new AccountsMemoryPersistence();
        let controller = new AccountsController();

        service = new AccountsGrpcServiceV1();
        service.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-accounts', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-accounts', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-accounts', 'service', 'grpc', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let packageDefinition = protoLoader.loadSync(
            __dirname + "../../../../../src/protos/accounts_v1.proto",
            {
                keepCase: true,
                longs: Number,
                enums: Number,
                defaults: true,
                oneofs: true
            }
        );
        let clientProto = grpc.loadPackageDefinition(packageDefinition).accounts_v1.Accounts;

        client = new clientProto('localhost:3000', grpc.credentials.createInsecure());
    });

    test('CRUD Operations', async () => {
        let account1, account2;

        // Create one account
        let account = await new Promise<any>((resolve, reject) => {
            client.create_account(
                {
                    account: ACCOUNT1
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.account);
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
            client.create_account(
                {
                    account: ACCOUNT2
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.account);
                }
            );
        });

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT2.id);
        assert.equal(account.login, ACCOUNT2.login);
        assert.equal(account.name, ACCOUNT2.name);
        assert.isTrue(account.active);

        account2 = account;

        // Create yet another account
        account = await new Promise<any>((resolve, reject) => {
            client.create_account(
                {
                    account: ACCOUNT3
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.account);
                }
            );
        });

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT3.id);
        assert.equal(account.login, ACCOUNT3.login);
        assert.equal(account.name, ACCOUNT3.name);
        assert.isTrue(account.active);

        account2 = account;

        // Get all accounts
        let page = await new Promise<any>((resolve, reject) => {
            client.get_accounts(
                {
                    filter: {}
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.page);
                }
            );
        });

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        // Update the account
        account1.name = 'Updated User 1';
        account = await new Promise<any>((resolve, reject) => {
            client.update_account(
                {
                    account: account1
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.account);
                }
            );
        });

        assert.isObject(account);
        assert.equal(account.id, account1.id)
        assert.equal(account.name, 'Updated User 1');
        assert.equal(account.login, account1.login);

        // Delete account
        await new Promise<any>((resolve, reject) => {
            client.delete_account_by_id(
                {
                    account_id: account1.id
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response);
                }
            );
        });

        // Try to get delete account
        account = await new Promise<any>((resolve, reject) => {
            client.delete_account_by_id(
                {
                    account_id: account1.id
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.account);
                }
            );
        });

        assert.isTrue(account.deleted);
    });
});
