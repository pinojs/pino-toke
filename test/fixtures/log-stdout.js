'use strict'

const pino = require('pino')
const { join } = require('path')

const options = {
  destination: parseInt(process.argv[2]),
  format: ':hostname',
  keep: false
}

const transport = pino.transport({
  target: join(__dirname, '../../index.js'),
  level: 'info',
  options
})

const log = pino(transport)

const logObj = require('./log-obj.json')
log.info(logObj)
