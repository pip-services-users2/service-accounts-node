"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const AccountsServiceFactory_1 = require("../build/AccountsServiceFactory");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
class AccountsProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super("accounts", "User accounts microservice");
        this._factories.add(new AccountsServiceFactory_1.AccountsServiceFactory);
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory);
        this._factories.add(new pip_services3_grpc_nodex_1.DefaultGrpcFactory);
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory);
    }
}
exports.AccountsProcess = AccountsProcess;
//# sourceMappingURL=AccountsProcess.js.map