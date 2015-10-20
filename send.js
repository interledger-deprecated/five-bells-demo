#!/usr/bin/env node
'use strict'

const co = require('co')
const request = require('co-request')
const send = require('@ripple/five-bells-sender')

const ledger1 = 'http://localhost:3001'
const ledger3 = 'http://localhost:3003'

co(function * () {
  yield create_account(ledger1, 'alice')
  yield create_account(ledger3, 'bob')

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

function * create_account (ledger, name) {
  let account_uri = toAccount(ledger, name)
  let getAccountRes = yield request({
    method: 'get',
    url: account_uri,
    json: true
  })
  if (getAccountRes.statusCode === 200) {
    return
  }

  let putAccountRes = yield request({
    method: 'put',
    url: account_uri,
    json: true,
    body: {
      name: account_uri,
      password: name,
      balance: '1500000'
    }
  })
  if (putAccountRes.statusCode >= 400) {
    throw new Error('Unexpected status code ' + putAccountRes.statusCode)
  }
}

function toAccount (ledger, name) {
  return ledger + '/accounts/' + encodeURIComponent(name)
}
