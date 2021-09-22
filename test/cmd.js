'use strict'

const cp = require('child_process')
const path = require('path')
const fs = require('fs')
const test = require('tap').test

const log = JSON.stringify(require('./fixtures/log-obj.json')) + '\n'
const cwd = path.resolve(__dirname, '..')

test('-h', function (t) {
  const expected = fs.readFileSync(path.join(cwd, 'usage.txt')) + '\n'
  const args = ['-h']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('--help', function (t) {
  const expected = fs.readFileSync(path.join(cwd, 'usage.txt')) + '\n'
  const args = ['--help']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('tokens', function (t) {
  const expected = 'MacBook-Pro-4 13961 GET /api/activity/component 200 (17 ms) application/json; charset=utf-8 _ga=GA1.1.204420087.1444842476\n\n'
  const args = [':hostname', ':pid', ':method', ':url', ':status', '(:response-time', 'ms)', ':res[content-type]', ':req[cookie]']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('-d', function (t) {
  const expected = '13961\n\n'
  const args = ['-d', '2', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('--destination', function (t) {
  const expected = '13961\n\n'
  const args = ['--destination', '2', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('--dest', function (t) {
  const expected = '13961\n\n'
  const args = ['--dest', '2', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('-d with custom fd', function (t) {
  const expected = '13961\n'
  const args = ['-d', '3', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[3] + '', expected)

  t.end()
})

test('-d 1', function (t) {
  const expected = '13961\n\n'
  const args = ['-d', '1', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('-d stderr', function (t) {
  const expected = '13961\n\n'
  const args = ['-d', 'stderr', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[2] + '', expected)

  t.end()
})

test('-d stdout', function (t) {
  const expected = '13961\n\n'
  const args = ['-d', 'stdout', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.is(result.output[1] + '', expected)

  t.end()
})

test('-a', function (t) {
  const expected = '13961\n\n'
  const args = ['-a', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('--ancillary', function (t) {
  const expected = '13961\n\n'
  const args = ['--ancillary', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('-a with custom fd', function (t) {
  const expected = '13961\n\n'
  const args = ['-a', '3', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[3] + '', msg)

  t.end()
})

test('-a 1 -d 2', function (t) {
  const expected = '13961\n\n'
  const args = ['-a', '1', '-d', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[2] + '', expected)
  t.is(result.output[1] + '', msg)

  t.end()
})

test('-a stderr', function (t) {
  const expected = '13961\n\n'
  const args = ['-a', 'stderr', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', msg)

  t.end()
})

test('-a stdout -d 2', function (t) {
  const expected = '13961\n\n'
  const args = ['-a', 'stdout', '-d', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[2] + '', expected)
  t.is(result.output[1] + '', msg)

  t.end()
})

test('-a 1 -d 1', function (t) {
  const expected = '13961'
  const args = ['-a', '1', '-d', '1', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })
  t.is(result.output[1] + '', expected + '\n' + msg + '\n')

  t.end()
})

test('-k -a 2', function (t) {
  const expected = '13961\n\n'
  const args = ['-k', '-a', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd: cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.is(result.output[1] + '', expected)
  t.is(result.output[2] + '', log + msg)

  t.end()
})
