'use strict'

var split = require('split2')
var stream = require('readable-stream')
var pump = stream.pipeline
var eos = stream.finished
var Transform = stream.Transform
var tokens = require('./tokens')

function parse () {
  function parseRow (row) {
    try {
      return JSON.parse(row)
    } catch (e) {
      // Ignore errors
    }
  }

  return split(parseRow)
}

module.exports = toke

toke.compile = compile

function toke (format, destination, ancillary) {
  var printer = parse()
  if (typeof format === 'object') {
    var opts = format
    format = opts.format
    var keep = opts.keep
  }
  var line = typeof format === 'function' ? format : compile(format)
  var transform = new Transform({
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
  var out = destination || process.stdout
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
