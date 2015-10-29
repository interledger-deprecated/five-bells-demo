#!/usr/bin/env node
'use strict'

const co = require('co')
const send = require('@ripple/five-bells-sender')
const argv = process.argv.slice(2)

if (argv.length !== 2) {
  console.error('usage: send.js <source_ledger> <destination_ledger>')
  process.exit(1)
}

co(function * () {
  yield send({
    source_ledger: argv[0],
    source_username: 'alice',
    source_password: 'alice',
    destination_ledger: argv[1],
    destination_username: 'bob',
    destination_amount: '1'
  })
}).catch(function (err) {
  console.error(err.stack)
  process.exit(1)
})
