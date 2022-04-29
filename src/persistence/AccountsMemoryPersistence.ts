import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { BadRequestException } from 'pip-services3-commons-nodex';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-nodex';

import { AccountV1 } from '../data/version1/AccountV1';
import { IAccountsPersistence } from './IAccountsPersistence';

export class AccountsMemoryPersistence 
    extends IdentifiableMemoryPersistence<AccountV1, string> 
    implements IAccountsPersistence {

    constructor() {
        super();
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    }

    private matchSearch(item: AccountV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        if (this.matchString(item.login, search))
            return true;
        return false;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let ids = filter.getAsObject('ids');
        let name = filter.getAsNullableString('name');
        let login = filter.getAsNullableString('login');
        let active = filter.getAsNullableBoolean('active');
        let fromCreateTime = filter.getAsNullableDateTime('from_create_time');
        let toCreateTime = filter.getAsNullableDateTime('to_create_time');
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        
        // Process ids filter
        if (typeof ids === 'string')
            ids = ids.split(',');
        if (!Array.isArray(ids))
            ids = null;
        
        return (item: AccountV1) => {
            if (id != null && id != item.id)
                return false;
            if (ids && ids.indexOf(item.id) < 0)
                return false;
            if (name != null && name != item.name)
                return false;
            if (login != null && login != item.login)
                return false;
            if (active != null && active != item.active)
                return false;
            if (fromCreateTime != null && item.create_time >= fromCreateTime)
                return false;
            if (toCreateTime != null && item.create_time < toCreateTime)
                return false;
            if (!deleted && item.deleted) 
                return false;
            if (search != null && !this.matchSearch(item, search))
                return false;
            return true;
        };
    }

    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<AccountV1>> {
        return await super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null);
    }

    public async getOneByLogin(correlationId: string, login: string): Promise<AccountV1> {
        let items = this._items.filter((x) => {return x.login == login;});
        let item = items.length > 0 ? items[0] : null;

        if (item != null)
            this._logger.trace(correlationId, "Retrieved item by %s", login);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", login);

        return item;
    }

    public async getOneByIdOrLogin(correlationId: string, idOrLogin: string): Promise<AccountV1> {
        let items = this._items.filter((x) => { return x.id == idOrLogin || x.login == idOrLogin; });
        let item = items.length > 0 ? items[0] : null;

        if (item != null)
            this._logger.trace(correlationId, "Retrieved item by %s", idOrLogin);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", idOrLogin);

        return item;
    }

    public async create(correlationId: string, item: AccountV1): Promise<AccountV1> {
        if (item == null) return;

        let existingItem = this._items.find((x) => x.login == item.login);
        if (existingItem != null)
            throw new BadRequestException(
                correlationId, 'ALREADY_EXIST', 
                'User account ' + item.login + ' already exist')
                .withDetails('login', item.login);
        

        item = Object.assign({}, item);
        item.active = item.active || true;
        item.create_time = new Date();

        return await super.create(correlationId, item);
    }
}
