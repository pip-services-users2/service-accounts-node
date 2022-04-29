import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { AccountV1 } from '../data/version1/AccountV1';
import { IAccountsController } from './IAccountsController';
export declare class AccountsController implements IConfigurable, IReferenceable, ICommandable, IAccountsController {
    private static _emailRegex;
    private static _defaultConfig;
    private _dependencyResolver;
    private _logger;
    private _persistence;
    private _commandSet;
    private _activitiesClient;
    private _loginAsEmail;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    getAccounts(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<AccountV1>>;
    getAccountById(correlationId: string, id: string): Promise<AccountV1>;
    getAccountByLogin(correlationId: string, login: string): Promise<AccountV1>;
    getAccountByIdOrLogin(correlationId: string, idOrLogin: string): Promise<AccountV1>;
    private validateAccount;
    private logUserActivity;
    createAccount(correlationId: string, account: AccountV1): Promise<AccountV1>;
    updateAccount(correlationId: string, account: AccountV1): Promise<AccountV1>;
    deleteAccountById(correlationId: string, id: string): Promise<AccountV1>;
}