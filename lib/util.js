const crypto = require('crypto')
const path = require('path')
const os = require('os')

const stringify = object => JSON.stringify(object, Object.keys(object).sort())

const hash = object => {
  const sha256 = crypto.createHash('sha256')
  sha256.update(stringify(object))
  return sha256.digest('hex').toString()
}

const cacheFile = (req, folder = os.tmpdir()) => path.join(folder, hash(req) + '.json')

module.exports = {cacheFile, stringify, hash}
