'use strict'

var ttyWrap = process.binding('tty_wrap')
var tty = require('tty')
var fs = require('fs')
var net = require('net')

module.exports = stdio

function stdio (fd) {
  var stream
  switch (ttyWrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd)
      stream._type = 'tty'
      break
    case 'FILE':
      stream = new fs.SyncWriteStream(fd, { autoClose: false })
      stream._type = 'fs'
      break
    case 'PIPE':
    case 'TCP':
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      })
      stream._type = 'pipe'
      break
    default:
      throw Error('Unknown stream type')
  }

  stream.fd = fd

  stream._isStdio = true

  return stream
}
