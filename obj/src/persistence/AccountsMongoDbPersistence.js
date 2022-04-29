"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsMongoDbPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_mongodb_nodex_1 = require("pip-services3-mongodb-nodex");
class AccountsMongoDbPersistence extends pip_services3_mongodb_nodex_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('accounts');
        super.ensureIndex({ login: 1 }, { unique: true });
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let criteria = [];
        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            criteria.push({ "$or": [
                    { login: { $regex: searchRegex } },
                    { name: { $regex: searchRegex } }
                ] });
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
            criteria.push({ $or: [{ deleted: false }, { deleted: { $exists: false } }] });
        return criteria.length > 0 ? { $and: criteria } : {};
    }
    getPageByFilter(correlationId, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, '-create_time', { custom_dat: 0 });
        });
    }
    getOneByLogin(correlationId, login) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this._collection.findOne({
                    login: login
                }, (err, item) => {
                    if (err)
                        reject(err);
                    this._logger.trace(correlationId, "Retrieved from %s with login = %s", this._collection, login);
                    item = this.convertToPublic(item);
                    resolve(item);
                });
            });
        });
    }
    getOneByIdOrLogin(correlationId, idOrLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this._collection.findOne({
                    $or: [
                        { _id: idOrLogin },
                        { login: idOrLogin }
                    ]
                }, (err, item) => {
                    if (err)
                        reject(err);
                    this._logger.trace(correlationId, "Retrieved from %s by %s", this._collection, idOrLogin);
                    item = this.convertToPublic(item);
                    resolve(item);
                });
            });
        });
    }
    create(correlationId, item) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (item == null)
                return;
            item = Object.assign({}, item);
            item.active = item.active || true;
            item.create_time = new Date();
            return yield _super.create.call(this, correlationId, item);
        });
    }
}
exports.AccountsMongoDbPersistence = AccountsMongoDbPersistence;
//# sourceMappingURL=AccountsMongoDbPersistence.js.map