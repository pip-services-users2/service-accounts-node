# User Accounts Microservice

This is a user account management microservice from Pip.Services library. 
* Registers users and creates their accounts
* Keeps key user descriptions and settings (about, location, language, theme, ...)

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca
* Persistence: In-Memory, Flat Files, MongoDB

This microservice has optional dependencies on the following microservices:
- [pip-services3-activities-nodex](https://github.com/pip-services-users2/pip-services3-activities-nodex) - to log user activities (signup, signin, change settings)

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-users2/client-accounts-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
  - [Seneca Version 1](doc/SenecaProtocolV1.md)

##  Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class AccountV1 implements IStringIdentifiable {
    /* Identification */
    public id: string;
    public login: string;
    public name: string;

    /* Activity tracking */
    public create_time: Date;
    public active: boolean;

    /* User preferences */
    public time_zone: string;
    public language: string;
    public theme: string;

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;
}

interface IAccountsV1 {
    getAccounts(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<AccountV1>>

    getAccountById(correlationId: string, id: string): Promise<AccountV1>;

    getAccountByLogin(correlationId: string, login: string): Promise<AccountV1>;

    getAccountByIdOrLogin(correlationId: string, idOrLogin: string): Promise<AccountV1>;
    createAccount(correlationId: string, account: AccountV1): Promise<AccountV1>;

    updateAccount(correlationId: string, account: AccountV1): Promise<AccountV1>;

    deleteAccountById(correlationId: string, id: string): Promise<AccountV1>;
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-users2/service-accounts-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 

Example of microservice configuration
```yaml
- descriptor: "pip-services3-container:container-info:default:default:1.0"
  name: "service-accounts"
  description: "User accounts microservice"

- descriptor: "pip-services3-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "service-accounts:persistence:file:default:1.0"
  path: "./data/accounts.json"

- descriptor: "service-accounts:controller:default:default:1.0"

- descriptor: "service-accounts:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-accounts-node": "^1.0.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
var sdk = new require('client-accounts-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
var config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.UsersHttpClientV1(config);

// Connect to the microservice
try {
    await client.open(null);
    
    // Work with the microservice
    ...
}
catch (err) {
    console.error('Connection to the microservice failed');
    console.error(err);
}
```

Now the client is ready to perform operations
```javascript
// Register a new user
let user = await client.createUser(
    null,
    { 
        name: 'Test User',
        email: 'somebody@somewhere.com'
    }
);
```

```javascript
// Get the user account
let user = await client.getUserByEmail(
    null,
    'somebody@somewhere.com',
);
```    

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.
