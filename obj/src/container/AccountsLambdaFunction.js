"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.AccountsLambdaFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_aws_nodex_1 = require("pip-services3-aws-nodex");
const AccountsServiceFactory_1 = require("../build/AccountsServiceFactory");
class AccountsLambdaFunction extends pip_services3_aws_nodex_1.CommandableLambdaFunction {
    constructor() {
        super("accounts", "User accounts function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-accounts', 'controller', 'default', '*', '*'));
        this._factories.add(new AccountsServiceFactory_1.AccountsServiceFactory());
    }
}
exports.AccountsLambdaFunction = AccountsLambdaFunction;
exports.handler = new AccountsLambdaFunction().getHandler();
//# sourceMappingURL=AccountsLambdaFunction.js.map