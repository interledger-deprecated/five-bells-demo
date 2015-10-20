#!/usr/bin/env node
'use strict'

const co = require('co')
const send = require('@ripple/five-bells-sender')

const ledger1 = 'http://localhost:3001'
const ledger3 = 'http://localhost:3003'

co(function * () {
  yield send({
    source_ledger: ledger1,
    source_username: 'alice',
    source_password: 'alice',
    destination_ledger: ledger3,
    destination_username: 'bob',
    destination_amount: '1'
  })
}).catch(function (err) {
  console.error(err.stack)
  process.exit(1)
})
