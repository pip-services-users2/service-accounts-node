"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsCommandableHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class AccountsCommandableHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/accounts');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-accounts', 'controller', 'default', '*', '1.0'));
    }
}
exports.AccountsCommandableHttpServiceV1 = AccountsCommandableHttpServiceV1;
//# sourceMappingURL=AccountsCommandableHttpServiceV1.js.map