'use strict'

var clfdate = require('clf-date')
var auth = require('basic-auth')

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
      var date = o._lastDate || new Date(o.time)
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
    var date = o._lastDate || new Date(o.time)
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
    var user = auth.parse(o.req.headers.authorization)
    if (!user) return
    return user.name
  },
  'http-version': function (o) {
    return o.res.header.substr(0, 8).split('/')[1]
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
    var headers = o._lastResHeaders || o.res.header.split(/\\r\\n|\r\n|:/)
    o._lastResHeaders = headers
    var index = headers.indexOf(field) + 1
    if (!index) return
    return headers[index].trim()
  }
}
