const request = require('request-promise-native')

class Api {
  static async getFoo() {
    const response = await request.get('https://www.heise.de/', {
      resolveWithFullResponse: true
    })
    response.foo = 'bar'
    return response
  }
}

module.exports = Api
