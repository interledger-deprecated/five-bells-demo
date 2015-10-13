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

  createTrader (name, port, ledger1, ledger2) {
    return {
      env: {
        TRADER_CREDENTIALS: JSON.stringify({
          [ledger1]: {
            username: name,
            password: name
          },
          [ledger2]: {
            username: name,
            password: name
          }
        }),
        TRADER_DEBUG_AUTOFUND: '1',
        TRADING_PAIRS: JSON.stringify([
          ['USD@' + ledger1, 'EUR@' + ledger2],
          ['EUR@' + ledger2, 'USD@' + ledger1]
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

  start () {
    const multiplexer = require('multiplexer')

    multiplexer([
      this.createLedger('gringotts', 3001),
      this.createLedger('bofe', 3002),
      this.createTrader('mark', 4001, 'http://localhost:3001', 'http://localhost:3002')
    ])
  }
}

module.exports = Demo
