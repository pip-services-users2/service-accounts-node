import { AccountsMemoryPersistence } from '../../src/persistence/AccountsMemoryPersistence';
import { AccountsPersistenceFixture } from './AccountsPersistenceFixture';

suite('AccountsMemoryPersistence', ()=> {
    let persistence: AccountsMemoryPersistence;
    let fixture: AccountsPersistenceFixture;
    
    setup(async () => {
        persistence = new AccountsMemoryPersistence();
        fixture = new AccountsPersistenceFixture(persistence);
        
        await persistence.open(null);
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