const { disableNetwork, enableNetwork, start, restore } = require('../')
const { cacheFile } = require('../lib/util')
const assert = require('assert')
const fs = require('fs-extra')
const http = require('http')

let server

before(done => {
  const s = http.createServer((req, res) => {
    if (req.url.includes('buffer')) {
      return res.end(Buffer.from('some data'))
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(req.url)
  }).listen(0, '127.0.0.1', () => {
    server = `http://127.0.0.1:${s.address().port}`
    done()
  })

  after(() => { s.close() })
})

beforeEach(start)
afterEach(restore)

const _req = (uri, options = {}) => {
  uri = server + uri
  return { ...options, uri, simple: false, resolveWithFullResponse: true }
}

describe('request-promise-native-record', () => {
  it('should record a response to disk', async () => {
    const req = _req('/abc')
    const file = cacheFile(req)
    await fs.remove(file)

    process.env.HTTP_MODE = 'record'
    const request = require('request-promise-native')
    let response = await request.get(req)

    assert.strict.equal(response.statusCode, 200)
    assert.strict.equal(response.body, '/abc')
    assert.ok(await fs.pathExists(file))
    await fs.remove(file)
    delete process.env.HTTP_MODE
  })

  it('should serve responses from disk', async () => {
    const req = _req('/')
    const file = cacheFile(req)
    await fs.writeJson(file, { statusCode: 666 })

    const request = require('request-promise-native')
    let response = await request.get(req)
    assert.strict.equal(response.statusCode, 666)
  })

  it('should work with external API code', async () => {
    const api = require('./fixtures/api')

    const response = await api.getFoo(server)
    assert.strict.equal(response.statusCode, 200)
    assert.strict.equal(response.body, '/?foo')
  })

  it('should trigger an exception if the network is disabled and a request is to be sent', async () => {
    const req = _req('/?151')
    try {
      disableNetwork()
      const request = require('request-promise-native')
      await request.get(req)
      throw new Error('network is not disabled')
    } catch (err) {
      assert.strict.equal(err.message, 'network disabled')
    }
    enableNetwork()
  })

  it('should support Buffers', async () => {
    const req = _req('/buffer', { encoding: null })
    const request = require('request-promise-native')

    // Writing to disk
    let res1 = await request.get(req)
    assert.ok(Buffer.isBuffer(res1.body))

    // Reading from disk
    let res2 = await request.get(req)
    assert.ok(Buffer.isBuffer(res2.body))
  })
})
