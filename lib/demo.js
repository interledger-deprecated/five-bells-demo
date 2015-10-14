'use strict'

class Demo {
  createLedger (name, port) {
    return {
      env: {
        DB_URI: 'sqlite:///tmp/' + name + '.sqlite',
        PATH: process.env.PATH,
        HOSTNAME: 'localhost',
        PORT: port
      },
      cwd: './node_modules/@ripple/five-bells-ledger',
      cmd: 'npm run migrate; npm start -- --color',
      waitFor: 'listening',
      alias: 'ledger-' + name
    }
  }

  createTrader (name, port, ledger1, ledger2, currency1, currency2) {
    return {
      env: {
        TRADER_CREDENTIALS: JSON.stringify({
          [ledger1]: {
            account_uri: ledger1 + '/accounts/' + encodeURIComponent(name),
            username: name,
            password: name
          },
          [ledger2]: {
            account_uri: ledger2 + '/accounts/' + encodeURIComponent(name),
            username: name,
            password: name
          }
        }),
        TRADER_DEBUG_AUTOFUND: '1',
        TRADING_PAIRS: JSON.stringify([
          [currency1 + '@' + ledger1, currency2 + '@' + ledger2],
          [currency2 + '@' + ledger2, currency1 + '@' + ledger1]
        ]),
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

    multiplexer([
      this.createLedger('gringotts', 3001),
      this.createLedger('bofe', 3002),
      this.createLedger('ledger3', 3003),
      this.createTrader('mark', 4001, 'http://localhost:3001', 'http://localhost:3002', 'USD', 'EUR'),
      this.createTrader('mary', 4002, 'http://localhost:3002', 'http://localhost:3003', 'EUR', 'GBP'),
      this.createVisualization(5001, 'http://localhost:3001')
    ])
  }
}

module.exports = Demo
