'use strict'

var split = require('split2')
var stream = require('readable-stream')
var SonicBoom = require('sonic-boom')

var pump = stream.pipeline
var eos = stream.finished
var Transform = stream.Transform
var tokens = require('./tokens')

function parse (opts) {
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
  // console.log(transformStream.end.toString());
  // transformStream.end = transformStream.destroy
  return transformStream
}

function toke (format, destination, ancillary) {
  var printer = parse({
    autoDestroy: true,
    destroy (err, cb) {
      console.log('aalakakakakakakakakakaakakakakakakakakkakaka');
      // printer.destroy()
      cb(err)
    }
  })

  // printer.on()

  if (typeof format === 'object') {
    var opts = format
    format = opts.format
    var keep = opts.keep
  }
  var line = typeof format === 'function' ? format : compile(format)
  var transform = new Transform({
    autoDestroy: true,
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

  printer.on('end', () => {
    console.log('===============printer closed');
  })
  // printer.on('finish', () => {
  //   console.log('---------------All writes are now complete.');
  // });
  // printer.on('data', (xxx) => {
  //   console.log('---------------All writes are now complete.',xxx);
  // });

  // const x = printer.end
  // process.nextTick(() => {

  //   printer.end = function (...a) {
  //     console.log(a);
  //     x.apply(printer, a);
  //   }
  // })
  // console.log(x);

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
