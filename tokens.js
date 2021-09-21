'use strict'

const clfdate = require('clf-date')
const auth = require('basic-auth')

module.exports = {
  id: function (o) {
    return o.req.id
  },
  pid: function (o) {
    return o.pid
  },
  level: function (o) {
    return o.level
  },
  hostname: function (o) {
    return o.hostname
  },
  url: function (o) {
    return o.req.url
  },
  time: function (o, format) {
    if (format === 'iso') {
      const date = o._lastDate || new Date(o.time)
      o._lastDate = date
      return date.toISOString().split('T')[1].split('.')[0]
    }
    return o.time
  },
  method: function (o) {
    return o.req.method
  },
  'response-time': function (o) {
    return o.responseTime
  },
  date: function (o, format) {
    const date = o._lastDate || new Date(o.time)
    o._lastDate = date
    return format === 'iso'
      ? date.toISOString()
      : (format === 'clf' ? clfdate(date) : date.toUTCString())
  },
  status: function (o) {
    return o.res.statusCode
  },
  referrer: function (o) {
    return o.req.headers.referer || o.req.headers.referrer
  },
  'remote-addr': function (o) {
    return o.req.remoteAddress
  },
  'remote-user': function (o) {
    const user = auth.parse(o.req.headers.authorization)
    if (!user) return
    return user.name
  },
  'user-agent': function (o) {
    return o.req.headers['user-agent']
  },
  req: function (o, field) {
    if (!field) return
    return o.req.headers[field.toLowerCase()]
  },
  res: function (o, field) {
    if (!field) return
    const headers = o._lastResHeaders || o.res.headers
    o._lastResHeaders = headers
    const key = headers[field]
    if (!key) return
    return key
  }
}
