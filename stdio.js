'use strict'

const ttyWrap = process.binding('tty_wrap')
const tty = require('tty')
const net = require('net')
const { Writable } = require('stream')
const { closeSync, writeSync } = require('fs')

module.exports = stdio

function stdio (fd) {
  var stream
  switch (ttyWrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd)
      stream._type = 'tty'
      break
    case 'FILE':
      stream = new SyncWriteStream(fd, { autoClose: false })
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

class SyncWriteStream extends Writable {
  constructor (fd, opts = {}) {
    super({ autoDestroy: true })
    const { autoClose = true } = opts
    this.fd = fd
    this.readable = false
    this.autoClose = autoClose
  }
  _write (chunk, _, cb) {
    writeSync(this.fd, chunk, 0, chunk.length)
    cb()
  }
  _destroy (err, cb) {
    if (this.fd === null) {
      cb(err)
      return
    }
    if (this.autoClose) closeSync(this.fd)
    this.fd = null
    cb(err)
  }
  destroySoon (err, cb) {
    this._destroy(err, cb)
  }
}
