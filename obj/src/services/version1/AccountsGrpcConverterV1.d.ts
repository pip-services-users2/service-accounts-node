import { DataPage } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { AccountV1 } from '../../data/version1/AccountV1';
export declare class AccountsGrpcConverterV1 {
    static fromError(err: any): any;
    static toError(obj: any): any;
    static setMap(map: any, values: any): void;
    static getMap(map: any): any;
    private static toJson;
    private static fromJson;
    static fromPagingParams(paging: PagingParams): any;
    static toPagingParams(obj: any): PagingParams;
    static fromAccount(account: AccountV1): any;
    static toAccount(obj: any): AccountV1;
    static fromAccountPage(page: DataPage<AccountV1>): any;
    static toAccountPage(obj: any): DataPage<AccountV1>;
}
