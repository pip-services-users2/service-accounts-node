const services = require('../../../../src/protos/accounts_v1_grpc_pb');
const messages = require('../../../../src/protos/accounts_v1_pb');

import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { GrpcService } from 'pip-services3-grpc-nodex';

import { IAccountsController } from '../../logic/IAccountsController';
import { AccountsGrpcConverterV1 } from './AccountsGrpcConverterV1';

export class AccountsGrpcServiceV1 extends GrpcService {
    private _controller: IAccountsController;
	
    public constructor() {
        super(services.AccountsService);
        this._dependencyResolver.put('controller', new Descriptor("service-accounts", "controller", "default", "*", "*"));
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IAccountsController>('controller');
    }
    
    private async getAccounts(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let filter = new FilterParams();
        AccountsGrpcConverterV1.setMap(filter, call.request.getFilterMap());
        let paging = AccountsGrpcConverterV1.toPagingParams(call.request.getPaging());

        let response = new messages.AccountPageReply();
        try {
            let result = await this._controller.getAccounts(correlationId, filter, paging); 
            let page = AccountsGrpcConverterV1.fromAccountPage(result);
            response.setPage(page);
        } catch (err) {
            let error = AccountsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async getAccountById(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let accountId = call.request.getAccountId();

        let response = new messages.AccountObjectReply();
        try {
            let result = await this._controller.getAccountById(correlationId, accountId);
            let account = AccountsGrpcConverterV1.fromAccount(result);
            response.setAccount(account);
        } catch (err) {
            let error = AccountsGrpcConverterV1.fromError(err);
            response.setError(error);
        }
        
        return response;
    }

    private async getAccountByLogin(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let login = call.request.getLogin();

        let response = new messages.AccountObjectReply();
        try {
            let result = await this._controller.getAccountByLogin(correlationId, login);
            let account = AccountsGrpcConverterV1.fromAccount(result);

            if (result)
                response.setAccount(account);
        } catch (err) {
            let error = AccountsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async getAccountByIdOrLogin(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let login = call.request.getLogin();

        let response = new messages.AccountObjectReply();
        try {
            let result = await this._controller.getAccountByIdOrLogin(correlationId, login);
            let account = AccountsGrpcConverterV1.fromAccount(result);
            if (result)
                response.setAccount(account);
        } catch(err) {
            let error = AccountsGrpcConverterV1.fromError(err);
            response.setError(error);
        }
        
        return response;
    }
    
    private async createAccount(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let account = AccountsGrpcConverterV1.toAccount(call.request.getAccount());

        let response = new messages.AccountObjectReply();
        try {
            let result = await this._controller.createAccount(correlationId, account);
            account = AccountsGrpcConverterV1.fromAccount(result);
            if (result)
                response.setAccount(account);
        } catch (err) {
            let error = AccountsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async updateAccount(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let account = AccountsGrpcConverterV1.toAccount(call.request.getAccount());

        let response = new messages.AccountObjectReply();
        try {
            let result = await this._controller.updateAccount(correlationId, account);
            account = AccountsGrpcConverterV1.fromAccount(result);
            if (result)
                response.setAccount(account);
        } catch (err) {
            let error = AccountsGrpcConverterV1.fromError(err);
            response.setError(error);
        }
        
        return response;
    }

    private async deleteAccountById(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let accountId = call.request.getAccountId();

        let response = new messages.AccountObjectReply();
        try {
            let result = await this._controller.deleteAccountById(correlationId, accountId);
            let account = AccountsGrpcConverterV1.fromAccount(result);
            if (result)
                response.setAccount(account);
        } catch (err) {
            let error = AccountsGrpcConverterV1.fromError(err);
            response.setError(error);
        }
        
        return response;
    }    
        
    public register() {
        this.registerMethod(
            'get_accounts', 
            null,
            this.getAccounts
        );

        this.registerMethod(
            'get_account_by_id', 
            null,
            this.getAccountById
        );

        this.registerMethod(
            'get_account_by_login', 
            null,
            this.getAccountByLogin
        );

        this.registerMethod(
            'get_account_by_id_or_login', 
            null,
            this.getAccountByIdOrLogin
        );

        this.registerMethod(
            'create_account', 
            null,
            this.createAccount
        );

        this.registerMethod(
            'update_account', 
            null,
            this.updateAccount
        );

        this.registerMethod(
            'delete_account_by_id',
            null, 
            this.deleteAccountById
        );
    }
}
