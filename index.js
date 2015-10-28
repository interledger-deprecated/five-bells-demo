'use strict'

const Demo = require('./lib/demo').Demo

let numLedgers = 8
let numTraders = 7

let barabasiAlbertConnectedCore = 2
let barabasiAlbertConnectionsPerNewNode = 2

if (process.env.DEMO_NUM_LEDGERS) {
  numLedgers = parseInt(process.env.DEMO_NUM_LEDGERS, 10)
}

if (process.env.DEMO_NUM_TRADERS) {
  numTraders = parseInt(process.env.DEMO_NUM_TRADERS, 10)
}

// A higher number here will result in more highly connected central ledgers
if (process.env.DEMO_CONNECTED_CORE) {
  barabasiAlbertConnectedCore = parseInt(process.env.DEMO_CONNECTED_CORE, 10)
}

// A higher number here will result in more connections between all ledgers
if (process.env.DEMO_CONNECTIONS_PER_NEW_NODE) {
  barabasiAlbertConnectionsPerNewNode = parseInt(process.env.DEMO_CONNECTIONS_PER_NEW_NODE, 10)
}

const demo = new Demo({
  numLedgers,
  numTraders,
  barabasiAlbertConnectedCore,
  barabasiAlbertConnectionsPerNewNode
})
demo.start()
