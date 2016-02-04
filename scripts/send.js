#!/usr/bin/env node
'use strict'

const co = require('co')
const send = require('five-bells-sender').default
const argv = process.argv.slice(2)

if (argv.length !== 2 && argv.length !== 4) {
  console.error('usage: send.js <source_ledger> <destination_ledger> [<notary> <notary-public-key>]')
  process.exit(1)
}

co(function * () {
  yield send({
    sourceAccount: argv[0] + '/accounts/alice',
    sourcePassword: 'alice',
    destinationAccount: argv[1] + '/accounts/bob',
    destinationAmount: '1',
    notary: argv[2],
    notaryPublicKey: argv[3]
  })
}).catch(function (err) {
  console.error(err.stack)
  process.exit(1)
})
