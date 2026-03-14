'use strict'

const test = require('node:test')
const os = require('node:os')
const fs = require('node:fs')
const { spawnSync } = require('node:child_process')
const { join } = require('node:path')
const { once } = require('node:events')
const { promisify } = require('node:util')
const pino = require('pino')

const logObj = require('./fixtures/log-obj.json')
const timeout = promisify(setTimeout)

test('tock pino transport test', async t => {
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
  t.assert.ok('built pino')
  await once(transport, 'ready')
  t.assert.ok('transport ready ' + destination)

  log.info(logObj)
  log.debug(logObj)
  log.flush()

  await timeout(1000)

  const data = fs.readFileSync(destination, 'utf8')
  t.assert.equal(data.trim(), logObj.hostname)
})

test('tock pino transport test stdout', async t => {
  const result = spawnSync('node', [join(__dirname, 'fixtures', 'log-stdout.js'), '1'], {
    cwd: process.cwd()
  })
  t.assert.equal(result.output[1].toString().trim(), logObj.hostname)
})

test('tock pino transport test stderr', async t => {
  const result = spawnSync('node', [join(__dirname, 'fixtures', 'log-stdout.js'), '2'], {
    cwd: process.cwd()
  })
  t.assert.equal(result.output[2].toString().trim(), logObj.hostname)
})

test('tock pino transport test', async t => {
  try {
    const transport = pino.transport({
      target: join(__dirname, '../index.js'),
      level: 'info'
    })
    pino(transport)
    await once(transport, 'ready')
    t.assert.fail('should not be ready')
  } catch (error) {
    t.assert.equal(error.message, 'Missing format option')
  }
})
