const debug = require('debug')('request-promise-native-record')
const fs = require('fs-extra')
const mockery = require('mockery')
const util = require('./lib/util')
const request = require('request-promise-native/lib/rp')
const os = require('os')

let _networkDisabled = false

const disableNetwork = () => { _networkDisabled = true }
const enableNetwork = () => { _networkDisabled = false }

const restore = () => {
  mockery.disable()
  mockery.deregisterAll()
}

const start = ({folder = os.tmpdir()} = {}) => {
  mockery.enable({
    warnOnUnregistered: false,
    useCleanCache: true
  })

  mockery.registerMock('request-promise-native', {
    get: async (url, options) => {
      if (!options) {
        options = url
      } else {
        options.uri = url
      }

      const file = util.cacheFile(options, folder)
      let content

      try {
        if (process.env.HTTP_MODE === 'record') throw new Error()
        debug(`require ${file} ...`)
        content = require(file)
        debug(`successfully required ${file}.`)
      } catch (e) {
        if (_networkDisabled) throw new Error('network disabled')
        debug('requesting', url)

        content = await request(options)
        debug(`writing ${file} ... `)
        try {
          delete content.request.headers.Authorization
        } catch (e) {}
        await fs.writeFile(file, JSON.stringify(content, null, '  '))
      }
      return Promise.resolve(content)
    }
  })
}

module.exports = {
  disableNetwork,
  enableNetwork,
  start,
  restore,
}
