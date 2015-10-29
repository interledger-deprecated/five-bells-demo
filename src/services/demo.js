'use strict'

const Demo = require('../lib/demo').Demo
const config = require('./config')

module.exports = new Demo(config.graph)
