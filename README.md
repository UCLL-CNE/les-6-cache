# leesbare link

![Website logo](frontend/images/logo.png)

Starters project for the UCLL course *Cloud Native Engineering*
*leesbare link* is a website that allows you to create link mappings, just like bit.ly or other URL shorters. 
However, the purpose is not to shorten links, but to make them readable.

## How to run

The application does not use docker anymore. The backend, database and static site functionality all run in the cloud via:

 - Azure Functions
 - Cosmos DB
 - Azure Blob Storage static site hosting

In the `.vscode` folder there is a configuration for the *live server* extension to start up the frontend if you want to run the frontend locally.

## CI/CD

Workflows have been added to automatically deploy the `Azure Functions` and `Azure Blob Storage static site` on push.
You can take a look at them in the `.github` folder.
