"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsCommandableGrpcServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
class AccountsCommandableGrpcServiceV1 extends pip_services3_grpc_nodex_1.CommandableGrpcService {
    constructor() {
        super('v1/accounts');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-accounts', 'controller', 'default', '*', '*'));
    }
}
exports.AccountsCommandableGrpcServiceV1 = AccountsCommandableGrpcServiceV1;
//# sourceMappingURL=AccountsCommandableGrpcServiceV1.js.map