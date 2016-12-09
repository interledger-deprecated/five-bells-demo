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
