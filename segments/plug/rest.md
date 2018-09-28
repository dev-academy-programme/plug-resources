# REST Proxy

The REST proxy is a convention for structuring and communicating between clients and Web Servers through the [HTTP Protocol](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol).

Plug makes use of this Proxy to enable you to build clients, be it Browser Based Clients, or Terminal Clients, that can query and alter the state of your Plugin.

If you want to visually render a ledger of user balances and transactions stored within a browser client, or wish to view your own balance by entering a command in your command line, you will need to understanding how to use REST with Plug.

## What can plug do with REST?

If you run your Plugin and go to http://localhost:8181/_swagger,

Swagger builds a nice interface for your REST routes within Plug, and with this page you can see the many types of HTTP requests you can send sorted into categories.

Most of the routes can also be interacted with through this interface, so this is a great place to start for understanding the bredth of Plug with REST.

Because the URL bar of your browser sends GET requests, try going to http://localhost:8181/_swagger#!/status/get_api_v1_status in your browser. You should see the response text rendered, detailing the status of your running node.

## Postman

[Postman](https://www.getpostman.com/) is a great application that allows you to send HTTP requests of any method. We encourage you to use this tool over the swagger interface when it comes to testing your Plug REST endpoints.

By using Postman, you will be able to build out a full Plugin without needing a client side to trust that your code is working. This is a form of manual testing, so you should still write some [Unit Tests](../python/unit_testing) too.

## Standout Endpoints

| Endpoint | Method | Usage |
| --- | --- | --- |
| /_api/v1/transaction | POST | Apply a posted Transform to the state |
| /_api/v1/transaction/{transaction_hash} | GET | Receive information about a past transaction (transform, etc) |
| /_api/v1/query/{target}/{indexer}/{key} | GET | Retrieve information from the state sorted by model, indexer and key |
