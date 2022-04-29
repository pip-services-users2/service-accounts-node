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
exports.AccountsController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const AccountActivityTypeV1_1 = require("../data/version1/AccountActivityTypeV1");
const AccountsCommandSet_1 = require("./AccountsCommandSet");
const client_activities_node_1 = require("client-activities-node");
class AccountsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_nodex_2.DependencyResolver(AccountsController._defaultConfig);
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        this._loginAsEmail = false;
    }
    configure(config) {
        config = config.setDefaults(AccountsController._defaultConfig);
        this._dependencyResolver.configure(config);
        this._loginAsEmail = config.getAsBooleanWithDefault('options.login_as_email', this._loginAsEmail);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._activitiesClient = this._dependencyResolver.getOneOptional('activities');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new AccountsCommandSet_1.AccountsCommandSet(this);
        return this._commandSet;
    }
    getAccounts(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getPageByFilter(correlationId, filter, paging);
        });
    }
    getAccountById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getOneById(correlationId, id);
        });
    }
    getAccountByLogin(correlationId, login) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getOneByLogin(correlationId, login);
        });
    }
    getAccountByIdOrLogin(correlationId, idOrLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getOneByIdOrLogin(correlationId, idOrLogin);
        });
    }
    validateAccount(correlationId, account) {
        if (account.name == null) {
            throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_NAME', 'Missing account name');
        }
        if (this._loginAsEmail) {
            if (account.login == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_EMAIL', 'Missing account primary email');
            }
            if (!AccountsController._emailRegex.test(account.login)) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'WRONG_EMAIL', 'Invalid account primary email ' + account.login).withDetails('login', account.login);
            }
        }
        else {
            if (account.login == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_LOGIN', 'Missing account login');
            }
        }
    }
    logUserActivity(correlationId, account, activityType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._activitiesClient) {
                try {
                    yield this._activitiesClient.logPartyActivity(correlationId, new client_activities_node_1.PartyActivityV1(null, activityType, {
                        id: account.id,
                        type: 'account',
                        name: account.name
                    }));
                }
                catch (err) {
                    this._logger.error(correlationId, err, 'Failed to log user activity');
                }
            }
        });
    }
    createAccount(correlationId, account) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate account
            this.validateAccount(correlationId, account);
            // Verify if account already registered
            let data = yield this._persistence.getOneByLogin(correlationId, account.login);
            // Verify if account already registered
            if (data != null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'ALREADY_EXIST', 'User account ' + account.login + ' already exist').withDetails('login', account.login);
            }
            // Create account object
            account = yield this._persistence.create(correlationId, account);
            // Log activity
            yield this.logUserActivity(correlationId, account, AccountActivityTypeV1_1.AccountActivityTypeV1.AccountCreated);
            return account;
        });
    }
    updateAccount(correlationId, account) {
        return __awaiter(this, void 0, void 0, function* () {
            let oldAccount;
            // Validate account
            this.validateAccount(correlationId, account);
            // Verify if account with new login already registered
            let data = yield this._persistence.getOneByLogin(correlationId, account.login);
            if (data != null && data.id != account.id) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'ALREADY_EXIST', 'User account ' + account.login + ' is already exist').withDetails('login', account.login);
            }
            if (data != null && data.id == account.id) {
                oldAccount = data;
            }
            // Get the account
            oldAccount = yield this._persistence.getOneById(correlationId, account.id);
            if (oldAccount == null) {
                throw new pip_services3_commons_nodex_4.NotFoundException(correlationId, 'NOT_FOUND', 'User account ' + account.id + ' was not found').withDetails('id', account.id);
            }
            // Change name and other fields and save
            account = yield this._persistence.update(correlationId, account);
            // Log activity
            yield this.logUserActivity(correlationId, account, AccountActivityTypeV1_1.AccountActivityTypeV1.AccountChanged);
            return account;
        });
    }
    deleteAccountById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let oldAccount;
            let newAccount;
            // Get account
            oldAccount = yield this._persistence.getOneById(correlationId, id);
            // Set logical deletion flag
            if (oldAccount == null)
                return;
            newAccount = Object.assign({}, oldAccount);
            newAccount.deleted = true;
            newAccount = yield this._persistence.update(correlationId, newAccount);
            if (oldAccount)
                yield this.logUserActivity(correlationId, oldAccount, AccountActivityTypeV1_1.AccountActivityTypeV1.AccountDeleted);
            return newAccount;
        });
    }
}
exports.AccountsController = AccountsController;
AccountsController._emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
AccountsController._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('dependencies.persistence', 'service-accounts:persistence:*:*:1.0', 'dependencies.activities', 'pip-services3-activities:client:*:*:1.0', 'options.login_as_email', false);
//# sourceMappingURL=AccountsController.js.map