'use strict'

const co = require('co')
const path = require('path')
if (process.env.SEED_FOR_REPEATABILITY) {
  const seedrandom = require('seedrandom')
  // replace Math.random:
  seedrandom(process.env.SEED_FOR_REPEATABILITY, { global: true })
}
const randomgraph = require('randomgraph')
const ServiceManager = require('five-bells-service-manager')

const connectorNames = [
  'mark', 'mary', 'martin', 'millie',
  'mia', 'mike', 'mesrop', 'michelle',
  'milo', 'miles', 'michael', 'micah', 'max'
]

const currencies = [
  { code: 'AUD', symbol: 'A$' },
  { code: 'BGN', symbol: 'лв' },
  { code: 'BRL', symbol: 'R$' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'CHF', symbol: 'Fr.' },
  { code: 'CNY', symbol: '¥' },
  { code: 'CZK', symbol: 'Kč' },
  { code: 'DKK', symbol: 'kr.' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'HKD', symbol: 'HK$' },
  { code: 'HRK', symbol: 'kn' },
  { code: 'HUF', symbol: 'Ft' },
  { code: 'IDR', symbol: 'Rp' },
  { code: 'ILS', symbol: '₪' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
  { code: 'KRW', symbol: '₩' },
  { code: 'MXN', symbol: 'Mex$' },
  { code: 'MYR', symbol: 'RM' },
  { code: 'NOK', symbol: 'kr' },
  { code: 'NZD', symbol: 'NZ$' },
  { code: 'PHP', symbol: '₱' },
  { code: 'PLN', symbol: 'zł' },
  { code: 'RON', symbol: 'lei' },
  { code: 'RUB', symbol: '₽' },
  { code: 'SEK', symbol: 'kr' },
  { code: 'SGD', symbol: 'S$' },
  { code: 'THB', symbol: '฿' },
  { code: 'TRY', symbol: '₺' },
  { code: 'USD', symbol: '$' },
  { code: 'ZAR', symbol: 'R' }
]

class Demo {
  constructor (opts) {
    const _this = this

    this.services = new ServiceManager(
      path.resolve(__dirname, '../../node_modules'),
      path.resolve(__dirname, '../../data'))
    this.adminUser = opts.adminUser
    this.adminPass = opts.adminPass

    this.numLedgers = opts.numLedgers
    this.numConnectors = opts.numConnectors
    this.barabasiAlbertConnectedCore = opts.barabasiAlbertConnectedCore || 2
    this.barabasiAlbertConnectionsPerNewNode = opts.barabasiAlbertConnectionsPerNewNode || 2

    if (process.env.npm_node_execpath && process.env.npm_execpath) {
      this.npmPrefix = process.env.npm_node_execpath + ' ' + process.env.npm_execpath
    } else {
      this.npmPrefix = 'npm'
    }

    // Connector graph
    // Barabási–Albert (N, m0, M)
    //
    // N .. number of nodes
    // m0 .. size of connected core (m0 <= N)
    // M .. (M <= m0)
    this.graph = randomgraph.BarabasiAlbert(
      this.numLedgers,
      this.barabasiAlbertConnectedCore,
      this.barabasiAlbertConnectionsPerNewNode)
    this.connectorEdges = new Array(this.numConnectors)
    this.connectorNames = new Array(this.numConnectors)
    for (let i = 0; i < this.numConnectors; i++) {
      this.connectorEdges[i] = []
      this.connectorNames[i] = connectorNames[i] || 'connector' + i
    }
    this.ledgerHosts = {}
    this.graph.edges.forEach(function (edge, i) {
      const source = edge.source
      const target = edge.target
      edge.source_currency = currencies[source % currencies.length].code
      edge.target_currency = currencies[target % currencies.length].code
      edge.source = 'demo.ledger' + source + '.'
      edge.target = 'demo.ledger' + target + '.'
      this.ledgerHosts[edge.source] = 'http://localhost:' + (3000 + source)
      this.ledgerHosts[edge.target] = 'http://localhost:' + (3000 + target)
      _this.connectorEdges[i % _this.numConnectors].push(edge)
    }, this)
  }

  start () {
    return co.wrap(this._start).call(this)
  }

  * _start () {
    for (let i = 0; i < this.numLedgers; i++) {
      yield this.startLedger('demo.ledger' + i + '.', 3000 + i)
    }

    for (let i = 0; i < this.numConnectors; i++) {
      yield this.setupConnectorAccounts(this.connectorNames[i], this.connectorEdges[i])
    }
    for (let i = 0; i < this.numConnectors; i++) {
      yield this.startConnector(this.connectorNames[i], this.connectorEdges[i])
    }
    yield this.services.startVisualization(5000)
  }

  * startLedger (ledger, port) {
    yield this.services.startLedger(ledger, port, {})
    yield this.services.updateAccount(ledger, 'alice', {balance: '1000'})
    yield this.services.updateAccount(ledger, 'bob', {balance: '1000'})
  }

  * startConnector (connector, edges) {
    yield this.services.startConnector(connector, {
      pairs: this.edgesToPairs(edges),
      credentials: this.edgesToCredentials(edges, connector),
      backend: 'fixerio'
    })
  }

  * setupConnectorAccounts (connector, edges) {
    for (const edge of edges) {
      yield this.services.updateAccount(edge.source, connector, {balance: '1000', connector: edge.source + connector})
      yield this.services.updateAccount(edge.target, connector, {balance: '1000', connector: edge.target + connector})
    }
  }

  edgesToPairs (edges) {
    const pairs = []
    for (const edge of edges) {
      pairs.push([
        edge.source_currency + '@' + edge.source,
        edge.target_currency + '@' + edge.target
      ])
      pairs.push([
        edge.target_currency + '@' + edge.target,
        edge.source_currency + '@' + edge.source
      ])
    }
    return pairs
  }

  edgesToCredentials (edges, connectorName) {
    const creds = {}
    for (const edge of edges) {
      creds[edge.source] = this.makeCredentials(edge.source, edge.source_currency, connectorName)
      creds[edge.target] = this.makeCredentials(edge.target, edge.target_currency, connectorName)
    }
    return creds
  }

  makeCredentials (ledger, currency, name) {
    return {
      currency: currency,
      plugin: 'ilp-plugin-bells',
      options: {
        account: this.ledgerHosts[ledger] + '/accounts/' + encodeURIComponent(name),
        username: name,
        password: name
      }
    }
  }
}

exports.Demo = Demo
