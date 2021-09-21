'use strict'

const t = require('tap')
const os = require('os')
const fs = require('fs')
const { join } = require('path')
const { once } = require('events')
const pino = require('pino')

const logLine = '{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"headers":{"content-type": "application/json; charset=utf-8","cache-control":"no-cache","vary":"accept-encoding","content-encoding":"gzip","date":"Thu, 21 Jul 2016 17:34:52 GMT","connection":"close","transfer-encoding":"chunked"}},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","authorization":"Basic QWxhZGRpbjpPcGVuU2VzYW1l","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}'

t.test('tock pino transport test', async t => {
  const destination = join(
    os.tmpdir(),
    '_' + Math.random().toString(36).substr(2, 9) + '.log'
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
  log.info(logLine)
  log.debug(logLine)

  log.flush(() => {})

  t.teardown(() => {
    fs.close(fd)
  })
})
