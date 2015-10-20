'use strict'

const randomgraph = require('randomgraph')
const ledgerCount = 8
const traderCount = 7

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
  edge.source = 'http://localhost:' + (3001 + edge.source)
  edge.target = 'http://localhost:' + (3001 + edge.target)
  traderEdges[i % traderCount].push(edge)
})

const traderNames = [
  'mark', 'mary', 'martin', 'millie',
  'mia', 'mike', 'mesrop', 'michelle',
  'milo', 'miles', 'michael', 'micah', 'max'
]

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
      pairs.push(['USD@' + edge.source, 'USD@' + edge.target])
      pairs.push(['USD@' + edge.target, 'USD@' + edge.source])
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
      this.createVisualization(5001, 'http://localhost:3001')
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
