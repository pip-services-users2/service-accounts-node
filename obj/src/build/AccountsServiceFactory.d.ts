import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
export declare class AccountsServiceFactory extends Factory {
    static Descriptor: Descriptor;
    static MemoryPersistenceDescriptor: Descriptor;
    static FilePersistenceDescriptor: Descriptor;
    static MongoDbPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static CmdHttpServiceDescriptor: Descriptor;
    static GrpcServiceDescriptor: Descriptor;
    static CommandableGrpcServiceDescriptor: Descriptor;
    constructor();
}
