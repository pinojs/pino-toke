'use strict'

var parse = require('ndjson').parse
var through = require('through2').obj
var pump = require('pump')
var tokens = require('./tokens')

module.exports = format

format.compile = compile

function format (fmt, destination, ancillary) {
  var printer = parse({strict: false})
  if (typeof fmt === 'object') {
    var opts = fmt
    fmt = opts.fmt
    var keep = opts.keep
  }
  var line = typeof fmt === 'function' ? fmt : compile(fmt)
  var transform = through(function (o, _, cb) {
    if (!(o.req && o.res && o.msg === 'request completed')) {
      if (ancillary) ancillary.write(JSON.stringify(o))
      return void cb()
    }
    if (keep && ancillary) ancillary.write(JSON.stringify(o) + '\n')
    cb(null, line(tokens, o))
  })
  var out = destination || process.stdout
  pump(printer, transform, out, function (err) {
    out.write((err ? err.message + '\n' : '\n'))
  })

  return printer
}

function compile (fmt) {
  return Function('tokens, o', 'return "' + fmt
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
