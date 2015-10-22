'use strict'

const Demo = require('./lib/demo').Demo

let numLedgers = 8
let numTraders = 7

if (process.env.DEMO_NUM_LEDGERS) {
  numLedgers = parseInt(process.env.DEMO_NUM_LEDGERS, 10)
}

if (process.env.DEMO_NUM_TRADERS) {
  numTraders = parseInt(process.env.DEMO_NUM_TRADERS, 10)
}

const demo = new Demo({
  numLedgers,
  numTraders
})
demo.start()
