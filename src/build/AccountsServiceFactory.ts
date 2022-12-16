import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { AccountsMongoDbPersistence } from '../persistence/AccountsMongoDbPersistence';
import { AccountsFilePersistence } from '../persistence/AccountsFilePersistence';
import { AccountsMemoryPersistence } from '../persistence/AccountsMemoryPersistence';
import { AccountsController } from '../logic/AccountsController';
import { AccountsCommandableHttpServiceV1 } from '../services/version1/AccountsCommandableHttpServiceV1';
import { AccountsGrpcServiceV1 } from '../services/version1/AccountsGrpcServiceV1';
import { AccountsCommandableGrpcServiceV1 } from '../services/version1/AccountsCommandableGrpcServiceV1';

export class AccountsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("service-accounts", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("service-accounts", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("service-accounts", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("service-accounts", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("service-accounts", "controller", "default", "*", "1.0");
	public static CmdHttpServiceDescriptor = new Descriptor("service-accounts", "service", "commandable-http", "*", "1.0");
	public static GrpcServiceDescriptor = new Descriptor("service-accounts", "service", "grpc", "*", "1.0");
	public static CommandableGrpcServiceDescriptor = new Descriptor("service-accounts", "service", "commandable-grpc", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(AccountsServiceFactory.MemoryPersistenceDescriptor, AccountsMemoryPersistence);
		this.registerAsType(AccountsServiceFactory.FilePersistenceDescriptor, AccountsFilePersistence);
		this.registerAsType(AccountsServiceFactory.MongoDbPersistenceDescriptor, AccountsMongoDbPersistence);
		this.registerAsType(AccountsServiceFactory.ControllerDescriptor, AccountsController);
		this.registerAsType(AccountsServiceFactory.CmdHttpServiceDescriptor, AccountsCommandableHttpServiceV1);
		this.registerAsType(AccountsServiceFactory.GrpcServiceDescriptor, AccountsGrpcServiceV1);
		this.registerAsType(AccountsServiceFactory.CommandableGrpcServiceDescriptor, AccountsCommandableGrpcServiceV1);
	}
	
}
