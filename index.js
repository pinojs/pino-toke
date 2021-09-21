'use strict'

const SonicBoom = require('sonic-boom')
const split = require('split2')
const stream = require('readable-stream')
const pump = stream.pipeline
const eos = stream.finished
const Transform = stream.Transform
const tokens = require('./tokens')

function buildTransportStream (opts) {
  function parseRow (row) {
    try {
      return JSON.parse(row)
    } catch (e) {
      // Ignore errors
    }
  }

  return split(parseRow, opts)
}

module.exports = tokeTransport
module.exports.default = tokeTransport
module.exports.toke = toke

toke.compile = compile

function tokeTransport (options) {
  const opts = options || {}
  const transformStream = toke(opts, getStream(opts.destination), getStream(opts.ancillary))
  // transformStream.end = transformStream.destroy
  return transformStream
}

function toke (format, destination, ancillary) {
  const printer = buildTransportStream({
    autoDestroy: true
  })

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

function compile (format) {
  return Function('tokens, o', 'return "' + format
    .replace(/"/g, '\\"')
    .replace(/\[\]/g, '')
    .replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function (_, name, arg) {
      return typeof tokens[name] === 'function'
        ? '" + (tokens["' + name + '"](o' + (arg ? ', "' + arg + '"' : '') + ') || "-") + "'
        : (arg ? ':' + name + '[' + arg + ']' : ':' + name)
    }) + '\\n"')
}

/* eslint no-useless-escape: 0 */
/* eslint no-new-func: 0 */

function getStream (fileDescriptor) {
  if (fileDescriptor === 1) return process.stdout
  else if (fileDescriptor === 2) return process.stderr
  else if (fileDescriptor !== undefined) return SonicBoom({ dest: parseInt(fileDescriptor), sync: false })
  return undefined
}
