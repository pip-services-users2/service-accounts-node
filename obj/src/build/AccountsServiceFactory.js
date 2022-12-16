"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const AccountsMongoDbPersistence_1 = require("../persistence/AccountsMongoDbPersistence");
const AccountsFilePersistence_1 = require("../persistence/AccountsFilePersistence");
const AccountsMemoryPersistence_1 = require("../persistence/AccountsMemoryPersistence");
const AccountsController_1 = require("../logic/AccountsController");
const AccountsCommandableHttpServiceV1_1 = require("../services/version1/AccountsCommandableHttpServiceV1");
const AccountsGrpcServiceV1_1 = require("../services/version1/AccountsGrpcServiceV1");
const AccountsCommandableGrpcServiceV1_1 = require("../services/version1/AccountsCommandableGrpcServiceV1");
class AccountsServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(AccountsServiceFactory.MemoryPersistenceDescriptor, AccountsMemoryPersistence_1.AccountsMemoryPersistence);
        this.registerAsType(AccountsServiceFactory.FilePersistenceDescriptor, AccountsFilePersistence_1.AccountsFilePersistence);
        this.registerAsType(AccountsServiceFactory.MongoDbPersistenceDescriptor, AccountsMongoDbPersistence_1.AccountsMongoDbPersistence);
        this.registerAsType(AccountsServiceFactory.ControllerDescriptor, AccountsController_1.AccountsController);
        this.registerAsType(AccountsServiceFactory.CmdHttpServiceDescriptor, AccountsCommandableHttpServiceV1_1.AccountsCommandableHttpServiceV1);
        this.registerAsType(AccountsServiceFactory.GrpcServiceDescriptor, AccountsGrpcServiceV1_1.AccountsGrpcServiceV1);
        this.registerAsType(AccountsServiceFactory.CommandableGrpcServiceDescriptor, AccountsCommandableGrpcServiceV1_1.AccountsCommandableGrpcServiceV1);
    }
}
exports.AccountsServiceFactory = AccountsServiceFactory;
AccountsServiceFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor("service-accounts", "factory", "default", "default", "1.0");
AccountsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-accounts", "persistence", "memory", "*", "1.0");
AccountsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-accounts", "persistence", "file", "*", "1.0");
AccountsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-accounts", "persistence", "mongodb", "*", "1.0");
AccountsServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-accounts", "controller", "default", "*", "1.0");
AccountsServiceFactory.CmdHttpServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-accounts", "service", "commandable-http", "*", "1.0");
AccountsServiceFactory.GrpcServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-accounts", "service", "grpc", "*", "1.0");
AccountsServiceFactory.CommandableGrpcServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-accounts", "service", "commandable-grpc", "*", "1.0");
//# sourceMappingURL=AccountsServiceFactory.js.map