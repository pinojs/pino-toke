'use strict'

const toke = require('../')
const through = require('through2')
const test = require('tap').test
const TimeShift = require('timeshift-js')

const log = '{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"headers":{"content-type": "application/json; charset=utf-8","cache-control":"no-cache","vary":"accept-encoding","content-encoding":"gzip","date":"Thu, 21 Jul 2016 17:34:52 GMT","connection":"close","transfer-encoding":"chunked"}},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","authorization":"Basic QWxhZGRpbjpPcGVuU2VzYW1l","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}\n'

test(':id', function (t) {
  const expected = '8\n'
  const logger = toke(':id', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':pid', function (t) {
  const expected = '13961\n'
  const logger = toke(':pid', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':hostname', function (t) {
  const expected = 'MacBook-Pro-4\n'
  const logger = toke(':hostname', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':level', function (t) {
  const expected = '30\n'
  const logger = toke(':level', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':url', function (t) {
  const expected = '/api/activity/component\n'
  const logger = toke(':url', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':time', function (t) {
  const expected = '1469122492244\n'
  const logger = toke(':time', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':time[ms]', function (t) {
  const expected = '1469122492244\n'
  const logger = toke(':time[ms]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':time[iso]', function (t) {
  const expected = '17:34:52\n'
  const logger = toke(':time[iso]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':method', function (t) {
  const expected = 'GET\n'
  const logger = toke(':method', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':response-time', function (t) {
  const expected = '17\n'
  const logger = toke(':response-time', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':date', function (t) {
  const expected = 'Thu, 21 Jul 2016 17:34:52 GMT\n'
  const logger = toke(':date', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':date[web]', function (t) {
  const expected = 'Thu, 21 Jul 2016 17:34:52 GMT\n'
  const logger = toke(':date', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':date[iso]', function (t) {
  const expected = '2016-07-21T17:34:52.244Z\n'
  const logger = toke(':date[iso]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':date[clf]', function (t) {
  /* eslint no-global-assign: 0 */
  Date = TimeShift.Date
  TimeShift.setTimezoneOffset(0)
  const expected = '21/Jul/2016:17:34:52 +0000\n'
  const logger = toke(':date[clf]', through(function (line) {
    t.equal(line.toString(), expected)
    Date = TimeShift.OriginalDate
    t.end()
  }))
  logger.write(log)
})

test(':date[clf] (JST)', function (t) {
  /* eslint no-global-assign: 0 */
  Date = TimeShift.Date
  TimeShift.setTimezoneOffset(-540)
  const expected = '22/Jul/2016:02:34:52 +0900\n'
  const logger = toke(':date[clf]', through(function (line) {
    t.equal(line.toString(), expected)
    Date = TimeShift.OriginalDate
    t.end()
  }))
  logger.write(log)
})

test(':status', function (t) {
  const expected = '200\n'
  const logger = toke(':status', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':referrer', function (t) {
  const expected = 'http://localhost:20000/\n'
  const logger = toke(':referrer', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log.replace('referer', 'referrer'))
})

test(':referrer (normalizing)', function (t) {
  const expected = 'http://localhost:20000/\n'
  const logger = toke(':referrer', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':remote-addr', function (t) {
  const expected = '127.0.0.1\n'
  const logger = toke(':remote-addr', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':remote-user', function (t) {
  const expected = 'Aladdin\n'
  const logger = toke(':remote-user', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':remote-user without authorization header', function (t) {
  const expected = '-\n'
  const logger = toke(':remote-user', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write('{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"header":"HTTP/1.1 200 OK\\r\\ncontent-type: application/json; charset=utf-8\\r\\ncache-control: no-cache\\r\\nvary: accept-encoding\\r\\ncontent-encoding: gzip\\r\\ndate: Thu, 21 Jul 2016 17:34:52 GMT\\r\\nconnection: close\\r\\ntransfer-encoding: chunked\\r\\n\\r\\n"},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}\n')
})

test(':user-agent', function (t) {
  const expected = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36\n'
  const logger = toke(':user-agent', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':req[<header>]', function (t) {
  const expected = 'keep-alive\n'
  const logger = toke(':req[connection]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':req[<invalid header>]', function (t) {
  const expected = '-\n'
  const logger = toke(':req[foo]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':req without header', function (t) {
  const expected = '-\n'
  const logger = toke(':req', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':res[<header>]', function (t) {
  const expected = 'application/json; charset=utf-8\n'
  const logger = toke(':res[content-type]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':res[<invalid header>]', function (t) {
  const expected = '-\n'
  const logger = toke(':res[foo]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':res without header', function (t) {
  const expected = '-\n'
  const logger = toke(':res', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':invalid-token', function (t) {
  const expected = ':invalid-token\n'
  const logger = toke(':invalid-token', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test(':invalid-token[with-arg]', function (t) {
  const expected = ':invalid-token[with-arg]\n'
  const logger = toke(':invalid-token[with-arg]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test('composition/interpolation', function (t) {
  const expected = 'MacBook-Pro-4 13961 GET /api/activity/component 200 (17 ms) application/json; charset=utf-8 _ga=GA1.1.204420087.1444842476\n'
  const logger = toke(':hostname :pid :method :url :status (:response-time ms) :res[content-type] :req[cookie]', through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test('outputs newline when stream ends', function (t) {
  const expected = '\n'
  const stream = through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  })
  toke(':pid', stream).end()
})

test('outputs error message when error in pipeline', function (t) {
  const expected = 'Premature close\n'
  const stream = through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  })
  toke(':pid', stream)
  stream.destroy()
})

test('logs to process.stdout by default', function (t) {
  const expected = '13961\n'
  const logger = toke(':pid')
  const write = process.stdout.write
  process.stdout.write = function (chunk, enc, cb) {
    process.stdout.write = write
    t.equal(chunk.toString(), expected)
    t.end()
  }
  logger.write(log)
})

test('outputs error message when error in pipeline', function (t) {
  const expected = 'Premature close\n'
  const stream = through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  })
  toke(':pid', stream)
  stream.destroy()
})

test('format as object', function (t) {
  const expected = '13961\n'
  const logger = toke({ format: ':pid' }, through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test('filters non-http messages by default', function (t) {
  const logger = toke(':pid', through(function (line) {
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
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const logger = toke(':pid', through(), through(function (line) {
    t.equal(line.toString() + '', msg)
    t.end()
  }))
  logger.write(msg)
})

test('keep: passes all messages to alternative stream', function (t) {
  const expected = '13961\n'
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  let count = 0
  const logger = toke({ format: ':pid', keep: true }, through(function (line, _, cb) {
    t.equal(line.toString(), expected)
    t.end()
    cb()
  }), through(function (line, _, cb) {
    count++

    if (count === 1) {
      t.equal(line.toString() + '', msg)
    }
    cb()
  }))

  logger.write(msg)
  logger.write(log)
})

test('custom function', function (t) {
  const expected = log
  const logger = toke(function (tokens, o) {
    return log
  }, through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})

test('toke.compile', function (t) {
  const expected = '13961\n'
  const logger = toke(function (tokens, o) {
    return toke.compile(':pid')(tokens, o)
  }, through(function (line) {
    t.equal(line.toString(), expected)
    t.end()
  }))
  logger.write(log)
})
