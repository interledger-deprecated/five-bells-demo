'use strict'

const demo = require('./src/services/demo')

demo.start().catch(function (err) {
  console.error(err.stack)
  process.exit(1)
})
