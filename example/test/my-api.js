const assert = require('assert')
const path = require('path')
const record = require('../..')

record.start({folder: path.join(__dirname, 'fixtures')})
const Api = require('../lib/my-api')

describe('My API', () => {
  it('sets "foo" to "bar" on response object', async () => {
    record.disableNetwork()
    let response = await Api.getFoo()
    assert.equal(response.foo, 'bar')
  })
})
