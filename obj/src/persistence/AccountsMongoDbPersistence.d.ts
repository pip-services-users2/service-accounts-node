import { DataPage, FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';
import { AccountV1 } from '../data/version1/AccountV1';
import { IAccountsPersistence } from './IAccountsPersistence';
export declare class AccountsMongoDbPersistence extends IdentifiableMongoDbPersistence<AccountV1, string> implements IAccountsPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<AccountV1>>;
    getOneByLogin(correlationId: string, login: string): Promise<AccountV1>;
    getOneByIdOrLogin(correlationId: string, idOrLogin: string): Promise<AccountV1>;
    create(correlationId: string, item: AccountV1): Promise<AccountV1>;
}
