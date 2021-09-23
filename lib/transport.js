'use strict'

const build = require('pino-abstract-transport')
const SonicBoom = require('sonic-boom')
const parser = require('./parser')
const tokens = require('./tokens')

module.exports = pinoTransport

/* istanbul ignore next */
function pinoTransport (options) {
  if (!options || !options.format) {
    throw new Error('Missing format option')
  }

  const { keep, format } = options
  const formatLineObject = typeof format === 'function'
    ? format
    : parser.compile(format)

  return build(function (source) {
    const destination = getStream(options.destination)
    const ancillary = getStream(options.ancillary)

    source.on('data', function (obj) {
      if (!(obj.req && obj.res && obj.msg === 'request completed')) {
        if (ancillary) ancillary.write(JSON.stringify(obj) + '\n')
        return null // ignore
      }
      if (keep && ancillary) ancillary.write(JSON.stringify(obj) + '\n')

      const canContinue = destination.write(formatLineObject(tokens, obj))
      if (!canContinue) {
        source.pause()
        destination.once('drain', () => { source.resume() })
      }
    })
  })
}

function getStream (fileDescriptor) {
  if (fileDescriptor === 1) return process.stdout
  else if (fileDescriptor === 2) return process.stderr
  else if (fileDescriptor !== undefined) return SonicBoom({ dest: parseInt(fileDescriptor), sync: false })
  return undefined
}
