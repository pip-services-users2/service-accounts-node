import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableLambdaFunction } from 'pip-services3-aws-nodex';
import { AccountsServiceFactory } from '../build/AccountsServiceFactory';

export class AccountsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("accounts", "User accounts function");
        this._dependencyResolver.put('controller', new Descriptor('service-accounts', 'controller', 'default', '*', '*'));
        this._factories.add(new AccountsServiceFactory());
    }
}

export const handler = new AccountsLambdaFunction().getHandler();