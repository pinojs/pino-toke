'use strict'

var { toke } = require('../')
var through = require('through2')
var test = require('tap').test
var TimeShift = require('timeshift-js')

var log = '{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"headers":{"content-type": "application/json; charset=utf-8","cache-control":"no-cache","vary":"accept-encoding","content-encoding":"gzip","date":"Thu, 21 Jul 2016 17:34:52 GMT","connection":"close","transfer-encoding":"chunked"}},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","authorization":"Basic QWxhZGRpbjpPcGVuU2VzYW1l","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}\n'

test(':id', function (t) {
  var expected = '8\n'
  var logger = toke(':id', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':pid', function (t) {
  var expected = '13961\n'
  var logger = toke(':pid', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':hostname', function (t) {
  var expected = 'MacBook-Pro-4\n'
  var logger = toke(':hostname', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':level', function (t) {
  var expected = '30\n'
  var logger = toke(':level', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':url', function (t) {
  var expected = '/api/activity/component\n'
  var logger = toke(':url', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':time', function (t) {
  var expected = '1469122492244\n'
  var logger = toke(':time', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':time[ms]', function (t) {
  var expected = '1469122492244\n'
  var logger = toke(':time[ms]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':time[iso]', function (t) {
  var expected = '17:34:52\n'
  var logger = toke(':time[iso]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':method', function (t) {
  var expected = 'GET\n'
  var logger = toke(':method', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':response-time', function (t) {
  var expected = '17\n'
  var logger = toke(':response-time', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':date', function (t) {
  var expected = 'Thu, 21 Jul 2016 17:34:52 GMT\n'
  var logger = toke(':date', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':date[web]', function (t) {
  var expected = 'Thu, 21 Jul 2016 17:34:52 GMT\n'
  var logger = toke(':date', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':date[iso]', function (t) {
  var expected = '2016-07-21T17:34:52.244Z\n'
  var logger = toke(':date[iso]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':date[clf]', function (t) {
  /* eslint no-global-assign: 0 */
  Date = TimeShift.Date
  TimeShift.setTimezoneOffset(0)
  var expected = '21/Jul/2016:17:34:52 +0000\n'
  var logger = toke(':date[clf]', through(function (line) {
    t.is(line.toString(), expected)
    Date = TimeShift.OriginalDate
    t.end()
  }))
  logger.write(log)
})

test(':date[clf] (JST)', function (t) {
  /* eslint no-global-assign: 0 */
  Date = TimeShift.Date
  TimeShift.setTimezoneOffset(-540)
  var expected = '22/Jul/2016:02:34:52 +0900\n'
  var logger = toke(':date[clf]', through(function (line) {
    t.is(line.toString(), expected)
    Date = TimeShift.OriginalDate
    t.end()
  }))
  logger.write(log)
})

test(':status', function (t) {
  var expected = '200\n'
  var logger = toke(':status', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':referrer', function (t) {
  var expected = 'http://localhost:20000/\n'
  var logger = toke(':referrer', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log.replace('referer', 'referrer'))
})

test(':referrer (normalizing)', function (t) {
  var expected = 'http://localhost:20000/\n'
  var logger = toke(':referrer', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':remote-addr', function (t) {
  var expected = '127.0.0.1\n'
  var logger = toke(':remote-addr', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':remote-user', function (t) {
  var expected = 'Aladdin\n'
  var logger = toke(':remote-user', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':remote-user without authorization header', function (t) {
  var expected = '-\n'
  var logger = toke(':remote-user', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write('{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"header":"HTTP/1.1 200 OK\\r\\ncontent-type: application/json; charset=utf-8\\r\\ncache-control: no-cache\\r\\nvary: accept-encoding\\r\\ncontent-encoding: gzip\\r\\ndate: Thu, 21 Jul 2016 17:34:52 GMT\\r\\nconnection: close\\r\\ntransfer-encoding: chunked\\r\\n\\r\\n"},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}\n')
})

test(':user-agent', function (t) {
  var expected = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36\n'
  var logger = toke(':user-agent', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':req[<header>]', function (t) {
  var expected = 'keep-alive\n'
  var logger = toke(':req[connection]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':req[<invalid header>]', function (t) {
  var expected = '-\n'
  var logger = toke(':req[foo]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':req without header', function (t) {
  var expected = '-\n'
  var logger = toke(':req', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':res[<header>]', function (t) {
  var expected = 'application/json; charset=utf-8\n'
  var logger = toke(':res[content-type]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':res[<invalid header>]', function (t) {
  var expected = '-\n'
  var logger = toke(':res[foo]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':res without header', function (t) {
  var expected = '-\n'
  var logger = toke(':res', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':invalid-token', function (t) {
  var expected = ':invalid-token\n'
  var logger = toke(':invalid-token', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':invalid-token[with-arg]', function (t) {
  var expected = ':invalid-token[with-arg]\n'
  var logger = toke(':invalid-token[with-arg]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test('composition/interpolation', function (t) {
  var expected = 'MacBook-Pro-4 13961 GET /api/activity/component 200 (17 ms) application/json; charset=utf-8 _ga=GA1.1.204420087.1444842476\n'
  var logger = toke(':hostname :pid :method :url :status (:response-time ms) :res[content-type] :req[cookie]', through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test('outputs newline when stream ends', function (t) {
  var expected = '\n'
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  toke(':pid', stream).end()
})

test('outputs error message when error in pipeline', function (t) {
  var expected = 'Premature close\n'
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  toke(':pid', stream)
  stream.destroy()
})

test('logs to process.stdout by default', function (t) {
  var expected = '13961\n'
  var logger = toke(':pid')
  var write = process.stdout.write
  process.stdout.write = function (chunk, enc, cb) {
    process.stdout.write = write
    t.is(chunk.toString(), expected)
    t.end()
  }
  logger.write(log)
})

test('outputs error message when error in pipeline', function (t) {
  var expected = 'Premature close\n'
  var stream = through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  })
  toke(':pid', stream)
  stream.destroy()
})

test('format as object', function (t) {
  var expected = '13961\n'
  var logger = toke({ format: ':pid' }, through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test('filters non-http messages by default', function (t) {
  var logger = toke(':pid', through(function (line) {
    t.fail()
    t.end()
  }))
  logger.write('{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n')
  setTimeout(function () {
    t.pass()
    t.end()
  }, 100)
})

test('ancillary: passes non-http messages to alternative stream when specified', function (t) {
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var logger = toke(':pid', through(), through(function (line) {
    t.is(line.toString() + '', msg)
    t.end()
  }))
  logger.write(msg)
})

test('keep: passes all messages to alternative stream', function (t) {
  var expected = '13961\n'
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var count = 0
  var logger = toke({ format: ':pid', keep: true }, through(function (line, _, cb) {
    t.is(line.toString(), expected)
    t.end()
    cb()
  }), through(function (line, _, cb) {
    count++

    if (count === 1) {
      t.is(line.toString() + '', msg)
    }
    if (count === 2) {
    }
    cb()
  }))

  logger.write(msg)
  logger.write(log)
})

test('custom function', function (t) {
  var expected = log
  var logger = toke(function (tokens, o) {
    return log
  }, through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test('toke.compile', function (t) {
  var expected = '13961\n'
  var logger = toke(function (tokens, o) {
    return toke.compile(':pid')(tokens, o)
  }, through(function (line) {
    t.is(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})
