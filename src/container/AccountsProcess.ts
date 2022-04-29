import { ProcessContainer } from 'pip-services3-container-nodex';

import { AccountsServiceFactory } from '../build/AccountsServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultGrpcFactory } from 'pip-services3-grpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

export class AccountsProcess extends ProcessContainer {

    public constructor() {
        super("accounts", "User accounts microservice");
        this._factories.add(new AccountsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
        this._factories.add(new DefaultGrpcFactory);
        this._factories.add(new DefaultSwaggerFactory);
    }

}
