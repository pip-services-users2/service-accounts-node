import { IReferences } from 'pip-services3-commons-nodex';
import { GrpcService } from 'pip-services3-grpc-nodex';
export declare class AccountsGrpcServiceV1 extends GrpcService {
    private _controller;
    constructor();
    setReferences(references: IReferences): void;
    private getAccounts;
    private getAccountById;
    private getAccountByLogin;
    private getAccountByIdOrLogin;
    private createAccount;
    private updateAccount;
    private deleteAccountById;
    register(): void;
}
