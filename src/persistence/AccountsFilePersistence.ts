import { ConfigParams } from 'pip-services3-commons-nodex';
import { JsonFilePersister } from 'pip-services3-data-nodex';

import { AccountsMemoryPersistence } from './AccountsMemoryPersistence';
import { AccountV1 } from '../data/version1/AccountV1';

export class AccountsFilePersistence extends AccountsMemoryPersistence {
	protected _persister: JsonFilePersister<AccountV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<AccountV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}