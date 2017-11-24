const assert = require('assert')
const record = require('../..')

record.start({folder: '/tmp'})
const Api = require('../lib/my-api')

describe('My API', () => {
  it('sets "foo" to "bar" on response object', async () => {
    let response = await Api.getFoo()
    assert.equal(response.foo, 'bar')
  })
})
