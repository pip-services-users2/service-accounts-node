import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IGetter } from 'pip-services3-data-nodex';
import { IWriter } from 'pip-services3-data-nodex';

import { AccountV1 } from '../data/version1/AccountV1';

export interface IAccountsPersistence extends IGetter<AccountV1, string>, IWriter<AccountV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<AccountV1>>;

    getOneById(correlationId: string, id: string): Promise<AccountV1>;

    getOneByLogin(correlationId: string, login: string): Promise<AccountV1>;

    getOneByIdOrLogin(correlationId: string, idOrLogin: string): Promise<AccountV1>;

    create(correlationId: string, user: AccountV1): Promise<AccountV1>;

    update(correlationId: string, user: AccountV1): Promise<AccountV1>;

    deleteById(correlationId: string, userId: string): Promise<AccountV1>;
}
