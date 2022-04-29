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
exports.AccountsGrpcServiceV1 = void 0;
const services = require('../../../../src/protos/accounts_v1_grpc_pb');
const messages = require('../../../../src/protos/accounts_v1_pb');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const AccountsGrpcConverterV1_1 = require("./AccountsGrpcConverterV1");
class AccountsGrpcServiceV1 extends pip_services3_grpc_nodex_1.GrpcService {
    constructor() {
        super(services.AccountsService);
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor("service-accounts", "controller", "default", "*", "*"));
    }
    setReferences(references) {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired('controller');
    }
    getAccounts(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let filter = new pip_services3_commons_nodex_2.FilterParams();
            AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.setMap(filter, call.request.getFilterMap());
            let paging = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.toPagingParams(call.request.getPaging());
            let response = new messages.AccountPageReply();
            try {
                let result = yield this._controller.getAccounts(correlationId, filter, paging);
                let page = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromAccountPage(result);
                response.setPage(page);
            }
            catch (err) {
                let error = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    getAccountById(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let accountId = call.request.getAccountId();
            let response = new messages.AccountObjectReply();
            try {
                let result = yield this._controller.getAccountById(correlationId, accountId);
                let account = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromAccount(result);
                response.setAccount(account);
            }
            catch (err) {
                let error = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    getAccountByLogin(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let login = call.request.getLogin();
            let response = new messages.AccountObjectReply();
            try {
                let result = yield this._controller.getAccountByLogin(correlationId, login);
                let account = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromAccount(result);
                if (result)
                    response.setAccount(account);
            }
            catch (err) {
                let error = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    getAccountByIdOrLogin(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let login = call.request.getLogin();
            let response = new messages.AccountObjectReply();
            try {
                let result = yield this._controller.getAccountByIdOrLogin(correlationId, login);
                let account = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromAccount(result);
                if (result)
                    response.setAccount(account);
            }
            catch (err) {
                let error = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    createAccount(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let account = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.toAccount(call.request.getAccount());
            let response = new messages.AccountObjectReply();
            try {
                let result = yield this._controller.createAccount(correlationId, account);
                account = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromAccount(result);
                if (result)
                    response.setAccount(account);
            }
            catch (err) {
                let error = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    updateAccount(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let account = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.toAccount(call.request.getAccount());
            let response = new messages.AccountObjectReply();
            try {
                let result = yield this._controller.updateAccount(correlationId, account);
                account = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromAccount(result);
                if (result)
                    response.setAccount(account);
            }
            catch (err) {
                let error = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    deleteAccountById(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let accountId = call.request.getAccountId();
            let response = new messages.AccountObjectReply();
            try {
                let result = yield this._controller.deleteAccountById(correlationId, accountId);
                let account = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromAccount(result);
                if (result)
                    response.setAccount(account);
            }
            catch (err) {
                let error = AccountsGrpcConverterV1_1.AccountsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    register() {
        this.registerMethod('get_accounts', null, this.getAccounts);
        this.registerMethod('get_account_by_id', null, this.getAccountById);
        this.registerMethod('get_account_by_login', null, this.getAccountByLogin);
        this.registerMethod('get_account_by_id_or_login', null, this.getAccountByIdOrLogin);
        this.registerMethod('create_account', null, this.createAccount);
        this.registerMethod('update_account', null, this.updateAccount);
        this.registerMethod('delete_account_by_id', null, this.deleteAccountById);
    }
}
exports.AccountsGrpcServiceV1 = AccountsGrpcServiceV1;
//# sourceMappingURL=AccountsGrpcServiceV1.js.map