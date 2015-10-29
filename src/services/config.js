'use strict'

exports.graph = {
  numLedgers: 8,
  numTraders: 7,
  barabasiAlbertConnectedCore: 2,
  barabasiAlbertConnectionsPerNewNode: 2
}

if (process.env.DEMO_NUM_LEDGERS) {
  exports.graph.numLedgers = parseInt(process.env.DEMO_NUM_LEDGERS, 10)
}

if (process.env.DEMO_NUM_TRADERS) {
  exports.graph.numTraders = parseInt(process.env.DEMO_NUM_TRADERS, 10)
}

// A higher number here will result in more highly connected central ledgers
if (process.env.DEMO_CONNECTED_CORE) {
  exports.graph.barabasiAlbertConnectedCore = parseInt(process.env.DEMO_CONNECTED_CORE, 10)
}

// A higher number here will result in more connections between all ledgers
if (process.env.DEMO_CONNECTIONS_PER_NEW_NODE) {
  exports.graph.barabasiAlbertConnectionsPerNewNode = parseInt(process.env.DEMO_CONNECTIONS_PER_NEW_NODE, 10)
}
