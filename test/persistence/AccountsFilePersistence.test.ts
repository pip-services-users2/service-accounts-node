import { AccountsFilePersistence } from '../../src/persistence/AccountsFilePersistence';
import { AccountsPersistenceFixture } from './AccountsPersistenceFixture';

suite('AccountsFilePersistence', ()=> {
    let persistence: AccountsFilePersistence;
    let fixture: AccountsPersistenceFixture;
    
    setup(async () => {
        persistence = new AccountsFilePersistence('./data/accounts.test.json');

        fixture = new AccountsPersistenceFixture(persistence);
        
        await persistence.open(null);
        await persistence.clear(null);
    });
    
    teardown(async () => {
        await persistence.close(null);
    });
        
    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Get with Filters', async () => {
        await fixture.testGetWithFilter();
    });
});