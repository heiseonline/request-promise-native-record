const request = require('request-promise-native')

const getFoo = server => {
  return request.get(`${server}/?foo`, {resolveWithFullResponse: true})
}

module.exports = {getFoo}
