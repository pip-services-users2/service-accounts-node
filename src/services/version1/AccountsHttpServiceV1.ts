import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableHttpService } from 'pip-services3-rpc-nodex';

export class AccountsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/accounts');
        this._dependencyResolver.put('controller', new Descriptor('service-accounts', 'controller', 'default', '*', '1.0'));
    }
}