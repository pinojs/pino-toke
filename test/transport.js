'use strict'

const t = require('tap')
const os = require('os')
const fs = require('fs')
const { spawnSync } = require('child_process')
const { join } = require('path')
const { once } = require('events')
const { promisify } = require('util')
const pino = require('pino')

const logObj = require('./fixtures/log-obj.json')
const timeout = promisify(setTimeout)

t.test('tock pino transport test', async t => {
  const destination = join(
    os.tmpdir(),
    'pino-transport-test.log'
  )

  const fd = fs.openSync(destination, 'w+')
  const options = {
    destination: fd,
    format: ':hostname',
    keep: false
  }

  const transport = pino.transport({
    target: join(__dirname, '../index.js'),
    level: 'info',
    options
  })
  const log = pino(transport)
  t.pass('built pino')
  await once(transport, 'ready')
  t.pass('transport ready ' + destination)

  log.info(logObj)
  log.debug(logObj)
  log.flush()

  await timeout(1000)

  const data = fs.readFileSync(destination, 'utf8')
  t.equal(data.trim(), logObj.hostname)
})

t.test('tock pino transport test stdout', async t => {
  const result = spawnSync('node', [join(__dirname, 'fixtures', 'log-stdout.js'), '1'], {
    cwd: process.cwd()
  })
  t.equal(result.output[1].toString().trim(), logObj.hostname)
})

t.test('tock pino transport test stderr', async t => {
  const result = spawnSync('node', [join(__dirname, 'fixtures', 'log-stdout.js'), '2'], {
    cwd: process.cwd()
  })
  t.equal(result.output[2].toString().trim(), logObj.hostname)
})

t.test('tock pino transport test', async t => {
  try {
    const transport = pino.transport({
      target: join(__dirname, '../index.js'),
      level: 'info'
    })
    pino(transport)
    await once(transport, 'ready')
    t.fail('should not be ready')
  } catch (error) {
    t.equal(error.message, 'Missing format option')
  }
})
