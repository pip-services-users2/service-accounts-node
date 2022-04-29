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
exports.AccountsCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_8 = require("pip-services3-commons-nodex");
const AccountV1Schema_1 = require("../data/version1/AccountV1Schema");
class AccountsCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the business logic
        this.addCommand(this.makeGetAccountsCommand());
        this.addCommand(this.makeGetAccountByIdCommand());
        this.addCommand(this.makeGetAccountByLoginCommand());
        this.addCommand(this.makeGetAccountByIdOrLoginCommand());
        this.addCommand(this.makeCreateAccountCommand());
        this.addCommand(this.makeUpdateAccountCommand());
        this.addCommand(this.makeDeleteAccountByIdCommand());
    }
    makeGetAccountsCommand() {
        return new pip_services3_commons_nodex_2.Command("get_accounts", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_nodex_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_nodex_8.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_nodex_4.PagingParams.fromValue(args.get("paging"));
            return yield this._logic.getAccounts(correlationId, filter, paging);
        }));
    }
    makeGetAccountByIdCommand() {
        return new pip_services3_commons_nodex_2.Command("get_account_by_id", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('account_id', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let accountId = args.getAsNullableString("account_id");
            return yield this._logic.getAccountById(correlationId, accountId);
        }));
    }
    makeGetAccountByLoginCommand() {
        return new pip_services3_commons_nodex_2.Command("get_account_by_login", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('login', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let accountId = args.getAsNullableString("login");
            return yield this._logic.getAccountByLogin(correlationId, accountId);
        }));
    }
    makeGetAccountByIdOrLoginCommand() {
        return new pip_services3_commons_nodex_2.Command("get_account_by_id_or_login", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('id_or_login', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let idOrLogin = args.getAsNullableString("id_or_login");
            return yield this._logic.getAccountByIdOrLogin(correlationId, idOrLogin);
        }));
    }
    makeCreateAccountCommand() {
        return new pip_services3_commons_nodex_2.Command("create_account", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('account', new AccountV1Schema_1.AccountV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let account = args.get("account");
            return yield this._logic.createAccount(correlationId, account);
        }));
    }
    makeUpdateAccountCommand() {
        return new pip_services3_commons_nodex_2.Command("update_account", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('account', new AccountV1Schema_1.AccountV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let account = args.get("account");
            return yield this._logic.updateAccount(correlationId, account);
        }));
    }
    makeDeleteAccountByIdCommand() {
        return new pip_services3_commons_nodex_2.Command("delete_account_by_id", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('account_id', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let accountId = args.getAsNullableString("account_id");
            return yield this._logic.deleteAccountById(correlationId, accountId);
        }));
    }
}
exports.AccountsCommandSet = AccountsCommandSet;
//# sourceMappingURL=AccountsCommandSet.js.map