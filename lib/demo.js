'use strict'

const randomgraph = require('randomgraph')
const ledgerCount = 8
const traderCount = 7

const traderNames = [
  'mark', 'mary', 'martin', 'millie',
  'mia', 'mike', 'mesrop', 'michelle',
  'milo', 'miles', 'michael', 'micah', 'max'
]

const currencies = [
  'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP',
  'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN', 'MYR',
  'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'THB', 'TRY',
  'USD', 'ZAR'
]

// Trader graph
// Barabási–Albert (N, m0, M)
//
// N .. number of nodes
// m0 .. size of connected core (m0 <= N)
// M .. (M <= m0)
const graph = randomgraph.BarabasiAlbert(ledgerCount, 2, 1)
const traderEdges = new Array(traderCount)
for (let i = 0; i < traderCount; i++) {
  traderEdges[i] = []
}
graph.edges.forEach(function (edge, i) {
  edge.source_currency = currencies[edge.source % currencies.length]
  edge.target_currency = currencies[edge.target % currencies.length]
  edge.source = 'http://localhost:' + (3001 + edge.source)
  edge.target = 'http://localhost:' + (3001 + edge.target)
  traderEdges[i % traderCount].push(edge)
})

class Demo {
  createLedger (name, port) {
    return {
      env: {
        PATH: process.env.PATH,
        LEDGER_DB_URI: 'sqlite:///tmp/' + name + '.sqlite',
        LEDGER_HOSTNAME: 'localhost',
        LEDGER_PORT: port
      },
      cwd: './node_modules/@ripple/five-bells-ledger',
      cmd: 'npm run migrate; npm start -- --color',
      waitFor: 'listening',
      alias: 'ledger-' + name
    }
  }

  createTrader (name, port, edges) {
    let creds = {}
    let pairs = []
    for (let edge of edges) {
      creds[edge.source] = makeCredentials(edge.source, name)
      creds[edge.target] = makeCredentials(edge.target, name)
      pairs.push([
        edge.source_currency + '@' + edge.source,
        edge.target_currency + '@' + edge.target
      ])
      pairs.push([
        edge.target_currency + '@' + edge.target,
        edge.source_currency + '@' + edge.source
      ])
    }
    return {
      env: {
        TRADER_CREDENTIALS: JSON.stringify(creds),
        TRADER_DEBUG_AUTOFUND: '1',
        TRADING_PAIRS: JSON.stringify(pairs),
        PATH: process.env.PATH,
        HOSTNAME: 'localhost',
        PORT: port
      },
      cwd: './node_modules/@ripple/five-bells-trader',
      cmd: 'npm start -- --color',
      alias: 'trader-' + name
    }
  }

  createVisualization (port, ledger) {
    return {
      env: {
        PATH: process.env.PATH,
        CRAWLER_INITIAL: ledger,
        HOSTNAME: 'localhost',
        PORT: port
      },
      cwd: './node_modules/@ripple/five-bells-visualization',
      cmd: 'npm start -- --color',
      alias: 'visualization'
    }
  }

  createAccount (ledger, name) {
    return {
      env: {
        PATH: process.env.PATH,
        LEDGER: ledger,
        USERNAME: name
      },
      cwd: './',
      cmd: './scripts/create-account.js',
      alias: 'create-account-' + name
    }
  }

  start () {
    const multiplexer = require('multiplexer')
    const processes = []
    for (let i = 0; i < ledgerCount; i++) {
      processes.push(this.createLedger('ledger' + i, 3001 + i))
    }

    for (let i = 0; i < traderCount; i++) {
      processes.push(this.createTrader(traderNames[i], 4001 + i, traderEdges[i]))
    }

    multiplexer(processes.concat([
      this.createVisualization(5001, 'http://localhost:3001'),
      this.createAccount('http://localhost:3001', 'alice'),
      this.createAccount('http://localhost:3003', 'bob')
    ]))
  }
}

module.exports = Demo

function makeCredentials (ledger, name) {
  return {
    account_uri: ledger + '/accounts/' + encodeURIComponent(name),
    username: name,
    password: name
  }
}
