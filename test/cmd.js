'use strict'

var cp = require('child_process')
var path = require('path')
var fs = require('fs')
var test = require('tap').test

var log = '{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"headers":{"content-type":"application/json; charset=utf-8","cache-control":"no-cache","vary":"accept-encoding","content-encoding":"gzip","date":"Thu, 21 Jul 2016 17:34:52 GMT","connection":"close","transfer-encoding":"chunked"}},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","authorization":"Basic QWxhZGRpbjpPcGVuU2VzYW1l","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}\n'
var cwd = path.resolve(__dirname, '..')

test('-h', function (t) {
  var expected = fs.readFileSync(path.join(cwd, 'usage.txt')) + '\n'
  var args = ['-h']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('--help', function (t) {
  var expected = fs.readFileSync(path.join(cwd, 'usage.txt')) + '\n'
  var args = ['--help']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('tokens', function (t) {
  var expected = 'MacBook-Pro-4 13961 GET /api/activity/component 200 (17 ms) application/json; charset=utf-8 _ga=GA1.1.204420087.1444842476\n\n'
  var args = [':hostname', ':pid', ':method', ':url', ':status', '(:response-time', 'ms)', ':res[content-type]', ':req[cookie]']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('-d', function (t) {
  var expected = '13961\n\n'
  var args = ['-d', '2', ':pid']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('--destination', function (t) {
  var expected = '13961\n\n'
  var args = ['--destination', '2', ':pid']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('--dest', function (t) {
  var expected = '13961\n\n'
  var args = ['--dest', '2', ':pid']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('-d with custom fd', function (t) {
  var expected = '13961\n'
  var args = ['-d', '3', ':pid']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[3] + '', expected)

  t.end()
})

test('-d 1', function (t) {
  var expected = '13961\n\n'
  var args = ['-d', '1', ':pid']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('-d stderr', function (t) {
  var expected = '13961\n\n'
  var args = ['-d', 'stderr', ':pid']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('-d stdout', function (t) {
  var expected = '13961\n\n'
  var args = ['-d', 'stdout', ':pid']
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('-a', function (t) {
  var expected = '13961\n\n'
  var args = ['-a', '2', ':pid']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('--ancillary', function (t) {
  var expected = '13961\n\n'
  var args = ['--ancillary', '2', ':pid']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('-a with custom fd', function (t) {
  var expected = '13961\n\n'
  var args = ['-a', '3', ':pid']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[3] + '', msg)

  t.end()
})

test('-a 1 -d 2', function (t) {
  var expected = '13961\n\n'
  var args = ['-a', '1', '-d', '2', ':pid']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[2] + '', expected)
  t.is(result.output[1] + '', msg)

  t.end()
})

test('-a stderr', function (t) {
  var expected = '13961\n\n'
  var args = ['-a', 'stderr', ':pid']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('-a stdout -d 2', function (t) {
  var expected = '13961\n\n'
  var args = ['-a', 'stdout', '-d', '2', ':pid']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[2] + '', expected)
  t.is(result.output[1] + '', msg)

  t.end()
})

test('-a 1 -d 1', function (t) {
  var expected = '13961'
  var args = ['-a', '1', '-d', '1', ':pid']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })
  t.is(result.output[1] + '', expected + '\n' + msg + '\n')

  t.end()
})

test('-k -a 2', function (t) {
  var expected = '13961\n\n'
  var args = ['-k', '-a', '2', ':pid']
  var msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  var result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', log + msg)

  t.end()
})
