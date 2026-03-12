'use strict'

const test = require('node:test')
const cp = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')

const log = JSON.stringify(require('./fixtures/log-obj.json')) + '\n'
const cwd = path.resolve(__dirname, '..')

test('-h', function (t, end) {
  const expected = fs.readFileSync(path.join(cwd, 'usage.txt')) + '\n'
  const args = ['-h']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[1] + '', expected)

  end()
})

test('--help', function (t, end) {
  const expected = fs.readFileSync(path.join(cwd, 'usage.txt')) + '\n'
  const args = ['--help']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[1] + '', expected)

  end()
})

test('tokens', function (t, end) {
  const expected = 'MacBook-Pro-4 13961 GET /api/activity/component 200 (17 ms) application/json; charset=utf-8 _ga=GA1.1.204420087.1444842476\n\n'
  const args = [':hostname', ':pid', ':method', ':url', ':status', '(:response-time', 'ms)', ':res[content-type]', ':req[cookie]']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[1] + '', expected)

  end()
})

test('-d', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-d', '2', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[2] + '', expected)

  end()
})

test('--destination', function (t, end) {
  const expected = '13961\n\n'
  const args = ['--destination', '2', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[2] + '', expected)

  end()
})

test('--dest', function (t, end) {
  const expected = '13961\n\n'
  const args = ['--dest', '2', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[2] + '', expected)

  end()
})

test('-d with custom fd', function (t, end) {
  const expected = '13961\n'
  const args = ['-d', '3', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[3] + '', expected)

  end()
})

test('-d 1', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-d', '1', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[1] + '', expected)

  end()
})

test('-d stderr', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-d', 'stderr', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[2] + '', expected)

  end()
})

test('-d stdout', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-d', 'stdout', ':pid']
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log
  })

  t.assert.equal(result.output[1] + '', expected)

  end()
})

test('-a', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-a', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.assert.equal(result.output[1] + '', expected)
  t.assert.equal(result.output[2] + '', msg)

  end()
})

test('--ancillary', function (t, end) {
  const expected = '13961\n\n'
  const args = ['--ancillary', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.assert.equal(result.output[1] + '', expected)
  t.assert.equal(result.output[2] + '', msg)

  end()
})

test('-a with custom fd', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-a', '3', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.assert.equal(result.output[1] + '', expected)
  t.assert.equal(result.output[3] + '', msg)

  end()
})

test('-a 1 -d 2', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-a', '1', '-d', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.assert.equal(result.output[2] + '', expected)
  t.assert.equal(result.output[1] + '', msg)

  end()
})

test('-a stderr', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-a', 'stderr', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.assert.equal(result.output[1] + '', expected)
  t.assert.equal(result.output[2] + '', msg)

  end()
})

test('-a stdout -d 2', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-a', 'stdout', '-d', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.assert.equal(result.output[2] + '', expected)
  t.assert.equal(result.output[1] + '', msg)

  end()
})

test('-a 1 -d 1', function (t, end) {
  const expected = '13961'
  const args = ['-a', '1', '-d', '1', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })
  t.assert.equal(result.output[1] + '', expected + '\n' + msg + '\n')

  end()
})

test('-k -a 2', function (t, end) {
  const expected = '13961\n\n'
  const args = ['-k', '-a', '2', ':pid']
  const msg = '{"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}\n'
  const result = cp.spawnSync('node', ['cmd.js'].concat(args), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    input: log + msg
  })

  t.assert.equal(result.output[1] + '', expected)
  t.assert.equal(result.output[2] + '', log + msg)

  end()
})
