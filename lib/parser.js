'use strict'

const tokens = require('./tokens')

module.exports.compile = compile

function compile (format) {
  /* eslint no-useless-escape: 0 */
  /* eslint no-new-func: 0 */
  return Function('tokens, o', 'return "' + format
    .replace(/"/g, '\\"')
    .replace(/\[\]/g, '')
    .replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function (_, name, arg) {
      return typeof tokens[name] === 'function'
        ? '" + (tokens["' + name + '"](o' + (arg ? ', "' + arg + '"' : '') + ') || "-") + "'
        : (arg ? ':' + name + '[' + arg + ']' : ':' + name)
    }) + '\\n"')
}
