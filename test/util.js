const assert = require('assert')
const util = require('../lib/util')

describe('Util', () => {
  it('#stringify', () => {
    const expected = '{"a":2,"x":{"a":2,"z":1},"z":1}'
    assert.equal(util.stringify({ z: 1, a: 2, x: { z: 1, a: 2 } }), expected)
    assert.equal(util.stringify({ a: 2, x: { z: 1, a: 2 }, z: 1 }), expected)
  })

  it('#hash()', () => {
    assert.equal(util.hash({ z: 1, a: 2, x: { z: 1, a: 2 } }), '6be7b86bb9875d04833250dbd131c82f6209d773f15b01d86673e3157dd8c449')
    assert.equal(util.hash({ x: { z: 1, a: 2 }, a: 2, z: 1 }), '6be7b86bb9875d04833250dbd131c82f6209d773f15b01d86673e3157dd8c449')
  })

  it('#_optionsParser()', () => {
    const uri = 'http://www.example.com'
    const expected = {uri, foo: true}

    assert.deepEqual(util._optionsParser(uri, {foo: true}), expected)
    assert.deepEqual(util._optionsParser({uri, foo: true}), expected)
  })

  it('#_normalizeUrl()', () => {
    assert.equal(
      util._normalizeUrl('http://www.example.com:3000'),
      'http://www.example.com/'
    )
  })
})
