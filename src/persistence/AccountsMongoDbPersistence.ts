import { DataPage, FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';

import { AccountV1 } from '../data/version1/AccountV1';
import { IAccountsPersistence } from './IAccountsPersistence';

export class AccountsMongoDbPersistence 
    extends IdentifiableMongoDbPersistence<AccountV1, string> 
    implements IAccountsPersistence {

    constructor() {
        super('accounts');
        super.ensureIndex({ login: 1 }, { unique: true });
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            criteria.push({ "$or": [
                { login: { $regex: searchRegex } },
                { name: { $regex: searchRegex } }
            ]});
        }

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        // Filter ids
        let ids = filter.getAsObject('ids');
        if (typeof ids == 'string')
            ids = ids.split(',');
        if (Array.isArray(ids))
            criteria.push({ _id: { $in: ids } });

        let name = filter.getAsNullableString('name');
        if (name != null)
            criteria.push({ name: name });

        let login = filter.getAsNullableString('login');
        if (login != null)
            criteria.push({ login: login });

        let active = filter.getAsNullableBoolean('active');
        if (active != null)
            criteria.push({ active: active });

        let fromTime = filter.getAsNullableDateTime('from_create_time');
        if (fromTime != null)
            criteria.push({ create_time: { $gte: fromTime } });

        let toTime = filter.getAsNullableDateTime('to_create_time');
        if (toTime != null)
            criteria.push({ create_time: { $lt: toTime } });

        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        if (!deleted)
            criteria.push({ $or: [ { deleted: false }, { deleted: { $exists: false } } ] });
                
        return criteria.length > 0 ? { $and: criteria } : {};
    }

    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<AccountV1>> {
        return await super.getPageByFilter(correlationId, this.composeFilter(filter), paging, '-create_time', { custom_dat: 0 });
    }

    public async getOneByLogin(correlationId: string, login: string): Promise<AccountV1> {

        return await new Promise<any>((resolve, reject) => {
            this._collection.findOne(
                {
                    login: login
                },
                (err, item) => {
                    if (err) reject(err);

                    this._logger.trace(correlationId, "Retrieved from %s with login = %s", this._collection, login);
                    item = this.convertToPublic(item);
                    resolve(item);
                }
            );
        });
        
    }

    public async getOneByIdOrLogin(correlationId: string, idOrLogin: string): Promise<AccountV1> {
        return await new Promise<any>((resolve, reject) => {
            this._collection.findOne(
                {
                    $or: [
                        { _id: idOrLogin },
                        { login: idOrLogin }
                    ]
                },
                (err, item) => {
                    if (err)
                        reject(err);

                    this._logger.trace(correlationId, "Retrieved from %s by %s", this._collection, idOrLogin);
                    item = this.convertToPublic(item);
                    resolve(item);
                }
            );
        });
        
    }

    public async create(correlationId: string, item: AccountV1): Promise<AccountV1> {
        if (item == null) return;

        item = Object.assign({}, item);
        item.active = item.active || true;
        item.create_time = new Date();

        return await super.create(correlationId, item);
    }

}
