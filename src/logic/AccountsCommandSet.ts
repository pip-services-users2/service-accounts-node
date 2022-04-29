import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommand } from 'pip-services3-commons-nodex';
import { Command } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';

import { AccountV1Schema } from '../data/version1/AccountV1Schema';
import { IAccountsController } from './IAccountsController';

export class AccountsCommandSet extends CommandSet {
    private _logic: IAccountsController;

    constructor(logic: IAccountsController) {
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

	private makeGetAccountsCommand(): ICommand {
		return new Command(
			"get_accounts",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            async (correlationId: string, args: Parameters) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                return await this._logic.getAccounts(correlationId, filter, paging);
            }
		);
	}

	private makeGetAccountByIdCommand(): ICommand {
		return new Command(
			"get_account_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('account_id', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let accountId = args.getAsNullableString("account_id");
                return await this._logic.getAccountById(correlationId, accountId);
            }
		);
	}

	private makeGetAccountByLoginCommand(): ICommand {
		return new Command(
			"get_account_by_login",
			new ObjectSchema(true)
				.withRequiredProperty('login', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let accountId = args.getAsNullableString("login");
                return await this._logic.getAccountByLogin(correlationId, accountId);
            }
		);
	}

	private makeGetAccountByIdOrLoginCommand(): ICommand {
		return new Command(
			"get_account_by_id_or_login",
			new ObjectSchema(true)
				.withRequiredProperty('id_or_login', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let idOrLogin = args.getAsNullableString("id_or_login");
                return await this._logic.getAccountByIdOrLogin(correlationId, idOrLogin);
            }
		);
	}

	private makeCreateAccountCommand(): ICommand {
		return new Command(
			"create_account",
			new ObjectSchema(true)
				.withRequiredProperty('account', new AccountV1Schema()),
			async (correlationId: string, args: Parameters) => {
                let account = args.get("account");
                return await this._logic.createAccount(correlationId, account);
            }
		);
	}

	private makeUpdateAccountCommand(): ICommand {
		return new Command(
			"update_account",
			new ObjectSchema(true)
				.withRequiredProperty('account', new AccountV1Schema()),
			async (correlationId: string, args: Parameters) => {
                let account = args.get("account");
                return await this._logic.updateAccount(correlationId, account);
            }
		);
	}
	
	private makeDeleteAccountByIdCommand(): ICommand {
		return new Command(
			"delete_account_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('account_id', TypeCode.String),
			async (correlationId: string, args: Parameters) => {
                let accountId = args.getAsNullableString("account_id");
                return await this._logic.deleteAccountById(correlationId, accountId);
			}
		);
	}

}