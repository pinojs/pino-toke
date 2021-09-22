'use strict'

const split = require('split2')
const stream = require('readable-stream')
const { compile } = require('./lib/parser')
const tokens = require('./lib/tokens')
const pinoTransport = require('./lib/transport')

const pump = stream.pipeline
const eos = stream.finished
const Transform = stream.Transform

function buildTransportStream () {
  function parseRow (row) {
    try {
      return JSON.parse(row)
    } catch (e) {
      // Ignore errors
    }
  }

  return split(parseRow, { autoDestroy: true })
}

module.exports = pinoTransport
module.exports.default = pinoTransport
module.exports.toke = toke

toke.compile = compile

function toke (format, destination, ancillary) {
  const printer = buildTransportStream()

  let keep
  if (typeof format === 'object') {
    const opts = format
    format = opts.format
    keep = opts.keep
  }
  const line = typeof format === 'function' ? format : compile(format)
  const transform = new Transform({
    objectMode: true,
    transform: function (o, _, cb) {
      if (!(o.req && o.res && o.msg === 'request completed')) {
        if (ancillary) ancillary.write(JSON.stringify(o) + '\n')
        cb()
        return
      }
      if (keep && ancillary) ancillary.write(JSON.stringify(o) + '\n')
      const toWrite = line(tokens, o)
      cb(null, toWrite)
    }
  })
  const out = destination || process.stdout
  pump(printer, transform, function (err) {
    if (err) {
      out.end(err.message + '\n')
      return
    }
    out.end('\n')
  })
  eos(out, function () {
    printer.destroy()
  })
  transform.pipe(out)

  return printer
}
