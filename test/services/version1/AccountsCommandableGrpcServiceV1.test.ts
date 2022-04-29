const assert = require('chai').assert;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

import { Descriptor } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { AccountV1 } from '../../../src/data/version1/AccountV1';
import { AccountsMemoryPersistence } from '../../../src/persistence/AccountsMemoryPersistence';
import { AccountsController } from '../../../src/logic/AccountsController';
import { AccountsCommandableGrpcServiceV1 } from '../../../src/services/version1/AccountsCommandableGrpcServiceV1';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let ACCOUNT1 = new AccountV1('1', 'account1@conceptual.vision', 'Test User 1');
let ACCOUNT2 = new AccountV1('2', 'account2@conceptual.vision', 'Test User 2');
let ACCOUNT3 = new AccountV1('3', 'account3@conceptual.vision', 'Test User 3');

suite('AccountsCommandableGrpcServiceV1', ()=> {
    let service: AccountsCommandableGrpcServiceV1;

    let client: any;

    suiteSetup(async () => {
        let persistence = new AccountsMemoryPersistence();
        let controller = new AccountsController();

        service = new AccountsCommandableGrpcServiceV1();
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
            __dirname + "../../../../../node_modules/pip-services3-grpc-nodex/src/protos/commandable.proto",
            {
                keepCase: true,
                longs: Number,
                enums: Number,
                defaults: true,
                oneofs: true
            }
        );
        let clientProto = grpc.loadPackageDefinition(packageDefinition).commandable.Commandable;

        client = new clientProto('localhost:3000', grpc.credentials.createInsecure());
    });

    test('CRUD Operations', async () => {
        let account1, account2;

        // Create one account
        let response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/accounts.create_account',
                    args_empty: false,
                    args_json: JSON.stringify({
                        account: ACCOUNT1
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        let account = JSON.parse(response.result_json);

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT1.id);
        assert.equal(account.login, ACCOUNT1.login);
        assert.equal(account.name, ACCOUNT1.name);
        assert.isTrue(account.active);

        account1 = account;

        // Create another account
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/accounts.create_account',
                    args_empty: false,
                    args_json: JSON.stringify({
                        account: ACCOUNT2
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        account = JSON.parse(response.result_json);

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT2.id);
        assert.equal(account.login, ACCOUNT2.login);
        assert.equal(account.name, ACCOUNT2.name);
        assert.isTrue(account.active);

        account2 = account;

        // Create yet another account
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/accounts.create_account',
                    args_empty: false,
                    args_json: JSON.stringify({
                        account: ACCOUNT3
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        account = JSON.parse(response.result_json);

        assert.isObject(account);
        assert.equal(account.id, ACCOUNT3.id);
        assert.equal(account.login, ACCOUNT3.login);
        assert.equal(account.name, ACCOUNT3.name);
        assert.isTrue(account.active);

        account2 = account;

        // Get all accounts
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/accounts.get_accounts',
                    args_empty: false,
                    args_json: JSON.stringify({
                        filter: {}
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        let page = JSON.parse(response.result_json);

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        // Update the account
        account1.name = 'Updated User 1';

        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/accounts.update_account',
                    args_empty: false,
                    args_json: JSON.stringify({
                        account: account1
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        account = JSON.parse(response.result_json);

        assert.isObject(account);
        assert.equal(account.id, account1.id)
        assert.equal(account.name, 'Updated User 1');
        assert.equal(account.login, account1.login);

        account1 = account;

        // Delete account
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/accounts.delete_account_by_id',
                    args_empty: false,
                    args_json: JSON.stringify({
                        account_id: account1.id
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);

        // Try to get delete account
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/accounts.get_account_by_id',
                    args_empty: false,
                    args_json: JSON.stringify({
                        account_id: account1.id
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);          
    });
});
