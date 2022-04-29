import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableGrpcService } from 'pip-services3-grpc-nodex';

export class AccountsCommandableGrpcServiceV1 extends CommandableGrpcService {
    public constructor() {
        super('v1/accounts');
        this._dependencyResolver.put('controller', new Descriptor('service-accounts', 'controller', 'default', '*', '*'));
    }
}