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
    source_ledger: argv[0],
    source_username: 'alice',
    source_password: 'alice',
    destination_ledger: argv[1],
    destination_username: 'bob',
    destination_amount: '1',
    notary: argv[2],
    notary_public_key: argv[3]
  })
}).catch(function (err) {
  console.error(err.stack)
  process.exit(1)
})
