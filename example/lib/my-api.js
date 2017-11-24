const request = require('request-promise-native')

class Api {
  static async getFoo() {
    const response = await request.get('http://example.com/', {
      resolveWithFullResponse: true
    })
    response.foo = 'bar'
    return response
  }
}

module.exports = Api
