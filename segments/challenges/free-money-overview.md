# Free Money Challenge Overview

The purpose of this challenge is to get a better understanding of how new Transforms are created in Plug, and how to work with them through a python client. Once completed, the Free Money Challenge will allow you to do several things. Using a command line interface, you will be able to:

- Query the balance of a specific User.
- Transfer money between two Users.
- Give some free money to a specific User.

You can find the [Free Money Challenge here.]({{book.freeMoneyChallenge}})

After completing the Free Money Challenge, you should feel confident in your understanding of the following areas:

- What [Models]({{book.models}}) are, and how they work.
- The process of creating a new [Transform]({{book.transforms}}) to manipulate the state of the blockchain.
- How to write client side code to manually POST Transform events to the server.
- The basics of the [Plug client_api]({{book.api-client}}), and how to get it posting your Transform events for you.
- Using the `key_manager` to generate and store local keys.

## Instructions:

Make sure you are in the folder containing your plug-libs repo.
```sh 
git clone http://github.com/dev-academy-programme/plug-free-money-challenge
cd plug-free-money-challenge
pipenv shell
```
Next install the Plug Core library and the plug api library

```sh
pipenv install ../plug-libs/plug_framework-0.0.24-py3-none-any.whl
pipenv install ../plug-libs/plug_api-2.0.1-py3-none-any.whl
```

General instructions for the [Free Money Challenge can be found here,]({{book.intro}}) and [a walk through of the solution here]({{book.solution}}). You should try working through the challenge yourself before consulting the solution.
