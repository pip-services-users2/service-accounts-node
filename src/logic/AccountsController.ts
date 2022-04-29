import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';
import { BadRequestException } from 'pip-services3-commons-nodex';
import { NotFoundException } from 'pip-services3-commons-nodex';

import { AccountV1 } from '../data/version1/AccountV1';
import { AccountActivityTypeV1 } from '../data/version1/AccountActivityTypeV1';
import { IAccountsPersistence } from '../persistence/IAccountsPersistence';
import { IAccountsController } from './IAccountsController';
import { AccountsCommandSet } from './AccountsCommandSet';

import { PartyActivityV1 } from 'client-activities-node';
import { IActivitiesClientV1 } from 'client-activities-node';

export class AccountsController implements IConfigurable, IReferenceable, ICommandable, IAccountsController {
    private static _emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'service-accounts:persistence:*:*:1.0',
        'dependencies.activities', 'pip-services3-activities:client:*:*:1.0',

        'options.login_as_email', false
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(AccountsController._defaultConfig);
    private _logger: CompositeLogger = new CompositeLogger();
    private _persistence: IAccountsPersistence;
    private _commandSet: AccountsCommandSet;
    private _activitiesClient: IActivitiesClientV1;
    private _loginAsEmail: boolean = false;

    public configure(config: ConfigParams): void {
        config = config.setDefaults(AccountsController._defaultConfig);
        this._dependencyResolver.configure(config);

        this._loginAsEmail = config.getAsBooleanWithDefault('options.login_as_email', this._loginAsEmail);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IAccountsPersistence>('persistence');
        this._activitiesClient = this._dependencyResolver.getOneOptional<IActivitiesClientV1>('activities');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new AccountsCommandSet(this);
        return this._commandSet;
    }
    
    public async getAccounts(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<AccountV1>> {
        return await this._persistence.getPageByFilter(correlationId, filter, paging);
    }

    public async getAccountById(correlationId: string, id: string): Promise<AccountV1> {
        return await this._persistence.getOneById(correlationId, id);
    }

    public async getAccountByLogin(correlationId: string, login: string): Promise<AccountV1> {
        return await this._persistence.getOneByLogin(correlationId, login);
    }

    public async getAccountByIdOrLogin(correlationId: string, idOrLogin: string): Promise<AccountV1> {
        return await this._persistence.getOneByIdOrLogin(correlationId, idOrLogin);
    }

    private validateAccount(correlationId: string, account: AccountV1): void {

        if (account.name == null) {
            throw new BadRequestException(
                correlationId, 
                'NO_NAME', 
                'Missing account name'
            );
        }

        if (this._loginAsEmail) {
            if (account.login == null) {
                throw new BadRequestException(
                    correlationId, 
                    'NO_EMAIL', 
                    'Missing account primary email'
                );
            }

            if (!AccountsController._emailRegex.test(account.login)) {
                throw new BadRequestException(
                        correlationId, 
                        'WRONG_EMAIL', 
                        'Invalid account primary email ' + account.login
                    ).withDetails('login', account.login);
            }
        } else {
            if (account.login == null) {
                throw new BadRequestException(
                    correlationId, 
                    'NO_LOGIN', 
                    'Missing account login'
                );
            }
        }
    }

    private async logUserActivity(correlationId: string, account: AccountV1, activityType: string): Promise<void> {
        if (this._activitiesClient) {
            try {
                await this._activitiesClient.logPartyActivity(
                    correlationId,
                    new PartyActivityV1(
                        null,
                        activityType,
                        {
                            id: account.id,
                            type: 'account',
                            name: account.name
                        }
                    )
                );
            } catch (err) {
                this._logger.error(correlationId, err, 'Failed to log user activity');
            }
        }
    }

    public async createAccount(correlationId: string, account: AccountV1): Promise<AccountV1> {

        // Validate account
        this.validateAccount(correlationId, account);

        // Verify if account already registered
        let data = await this._persistence.getOneByLogin(correlationId, account.login);

        // Verify if account already registered
        if (data != null) {
            throw new BadRequestException(
                correlationId,
                'ALREADY_EXIST',
                'User account ' + account.login + ' already exist'
            ).withDetails('login', account.login);
        }

        // Create account object
        account = await this._persistence.create(correlationId, account);

        // Log activity
        await this.logUserActivity(correlationId, account, AccountActivityTypeV1.AccountCreated);

        return account;
    }

    public async updateAccount(correlationId: string, account: AccountV1): Promise<AccountV1> {

        let oldAccount: AccountV1;

        // Validate account
        this.validateAccount(correlationId, account);

        // Verify if account with new login already registered
        let data = await this._persistence.getOneByLogin(correlationId, account.login);

        if (data != null && data.id != account.id) {
            throw new BadRequestException(
                correlationId,
                'ALREADY_EXIST',
                'User account ' + account.login + ' is already exist'
            ).withDetails('login', account.login);
        }

        if (data != null && data.id == account.id) {
            oldAccount = data;
        }

        // Get the account
        oldAccount = await this._persistence.getOneById(correlationId, account.id);

        if (oldAccount == null) {
            throw new NotFoundException(
                correlationId,
                'NOT_FOUND',
                'User account ' + account.id + ' was not found'
            ).withDetails('id', account.id);
        }

        // Change name and other fields and save
        account = await this._persistence.update(correlationId, account);

        // Log activity
        await this.logUserActivity(correlationId, account, AccountActivityTypeV1.AccountChanged);

        return account;
    }

    public async deleteAccountById(correlationId: string, id: string): Promise<AccountV1> {  
        let oldAccount: AccountV1;
        let newAccount: AccountV1;

        // Get account
        oldAccount = await this._persistence.getOneById(correlationId, id);

        // Set logical deletion flag
        if (oldAccount == null) return;

        newAccount = Object.assign({}, oldAccount);
        newAccount.deleted = true;

        newAccount = await this._persistence.update(correlationId, newAccount);

        if (oldAccount)
            await this.logUserActivity(correlationId, oldAccount, AccountActivityTypeV1.AccountDeleted);
        
        return newAccount;
    }

}
