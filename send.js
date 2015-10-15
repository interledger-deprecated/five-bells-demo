#!/usr/bin/env node
'use strict'

const co = require('co')
const request = require('co-request')
const send = require('@ripple/five-bells-sender')

const ledger1 = 'http://localhost:3001'
const ledger2 = 'http://localhost:3002'
const ledger3 = 'http://localhost:3003'
const trader1 = 'http://localhost:4001'
const trader2 = 'http://localhost:4002'

co(function * () {
  yield create_account(ledger1, 'alice')
  yield create_account(ledger3, 'bob')

  yield send({
    source_username: 'alice',
    source_password: 'alice',
    source_account: toAccount(ledger1, 'alice'),
    destination_account: toAccount(ledger3, 'bob'),
    destination_amount: '1'
  }, [
    {
      trader: trader1,
      source: ledger1,
      destination: ledger2
    },
    {
      trader: trader2,
      source: ledger2,
      destination: ledger3
    }
  ])
}).catch(function (err) {
  console.error(err.stack)
  process.exit(1)
})

function * create_account (ledger, name) {
  let account_uri = toAccount(ledger, name)
  let getAccountRes = yield request({
    method: 'get',
    url: account_uri,
    json: true,
  })
  if (getAccountRes.statusCode === 200) {
    return
  }

  let putAccountRes = yield request({
    method: 'put',
    url: account_uri,
    json: true,
    body: {
      name:     account_uri,
      password: name,
      balance: '1500000',
    }
  })
  if (putAccountRes.statusCode >= 400) {
    throw new Error('Unexpected status code ' + putAccountRes.statusCode)
  }
}

function toAccount (ledger, name) {
  return ledger + '/accounts/' + encodeURIComponent(name)
}
