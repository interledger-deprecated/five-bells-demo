# Five Bells Demo

> This is a demo of the [Interledger](https://interledger.org) protocol. It allows you to very quickly spin up a complete Interledger network and do test transactions.
>
> Please note that this reference code is intended for TESTING USE ONLY. Do not use with real funds.

![Screen recording of the demo in action](docs/assets/screencast.gif)

## Running the Demo

### Prerequisites

In order to try the Five Bells Demo, you need to make sure you have the following:

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org) (Version 6.x.x recommended)

### Step 1: Clone demo

``` sh
git clone https://github.com/interledgerjs/five-bells-demo.git
cd five-bells-demo
```

### Step 2: Install dependencies

``` sh
npm install --only=prod --no-optional
```

### Step 3: Run it!

``` sh
npm start
```

Visit [`http://localhost:5000`](http://localhost:5000) to see it in action! It should look something like this:

![Demo Screenshot showing circles representing ledgers connected by lines between them representing connectors](docs/assets/screenshot.png)

When you click a ledger and then click another ledger, you'll see a transaction executing.

### What am I looking at?

[Interledger Protocol (ILP)](https://interledger.org) is a protocol for making payments across different ledgers. This demo will create a bunch of ledgers (each one running in a separate Node.js process) on your local machine and then generate connect them using a bunch of randomly generated connectors. The connectors will use ILP routing to discover each other.

The demo also creates test sender accounts ("alice") and test receiver accounts ("bob") on each ledger. When you click two ledgers, an ILP sender will be created, which authenticates as Alice on the first ledger. This sender will then send to "Bob" on the second ledger you clicked.

When sending a payment on Interledger, the sender will first query the receiver using the SPSP protocol to determine the properties of the receiver and what types of payments are possible. They will then request an Interactive Payment Request (IPR) which describes the payment they are about to do. Next, they will ask their connector (think: router) for a quote. The connector may recurse and ask other connectors. Finally, the connector will return a description of a local transfer. This is a local transfer of funds from the sender to the connector on the sender's ledger. All of this happens invisibly within a split second. However, you can see most of these steps in the (fairly verbose) log of the demo.

If the sender is happy with the quoted rate (and the demo sender is always happy), she simply prepares the described local transfer. This means that her money is now on hold and the connector is notified. The connector then prepares a transfer (puts money on hold) on the next ledger and so on. This is shown in the demo by an orange bubble with the text "prepared" hovering over each ledger. When this chain reaches the recipient, they produce a receipt which triggers the execution in reverse order. This is shown in the demo by a green bubble with the text "executed" hovering over each ledger.

When an error occurs, transfers may be rolled back after a timeout. This is shown in the demo by a red bubble with the text "rejected" hovering over each ledger.

### Configuration

* `DEMO_NUM_LEDGERS` - Number of [`five-bells-ledger`](https://github.com/interledgerjs/five-bells-ledger) processes to start
* `DEMO_NUM_CONNECTORS` - Number of [`five-bells-connector`](https://github.com/interledgerjs/five-bells-connector) processes to start
* `DEMO_CONNECTED_CORE` - How connected the core ledgers in the generated graph should be (default: 2)
* `DEMO_CONNECTIONS_PER_NEW_NODE` - How many connections each ledger will be added with (default: 2, must be <= `DEMO_CONNECTED_CORE`)

### Warnings

When running the demo you will get a few warnings because components start up one by one and are trying to find each other.

## Components

This demo uses the following modules:

* [`five-bells-ledger`](https://github.com/interledgerjs/five-bells-ledger): Used as a ledger
* [`ilp-connector`](https://github.com/interledgerjs/five-bells-connector): Used for routing payments across ledgers
* [`ilp`](https://github.com/interledgerjs/ilp): Used as a sender and receiver component
* [`ilp-plugin-bells`](https://github.com/interledgerjs/ilp-plugin-bells): Plugin for talking to five-bells-ledger
* [`five-bells-visualization`](https://github.com/interledgerjs/five-bells-visualization): UI component to visualize what is happening

## Why "Five Bells"?

Legend (i.e. [Wikipedia](https://en.wikipedia.org/wiki/Bankers_clearing_house)) has it that before 1770, checks/cheques were cleared by clerks running between banks exchanging checks for cash.

![Cheque from 1659](docs/assets/cheque.jpg)

One day, two of the clerks from London banks recognized one another in the Five Bells Tavern on Lombard Street. The clerks started meeting daily at the Five Bells to clear checks, determine the banks' net positions and settle the remaining balances.

In the early 1800s, the group of clerks outgrew their space at the Five Bells and moved across the street to a dedicated building where check clearing would take place until the early 2000s.
