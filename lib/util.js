const crypto = require('crypto')
const path = require('path')
const url = require('url')
const os = require('os')

const stringify = object => JSON.stringify(object, Object.keys(object).sort())

const hash = object => {
  const sha256 = crypto.createHash('sha256')
  sha256.update(stringify(object))
  return sha256.digest('hex').toString()
}

const cacheFile = (req, folder = os.tmpdir()) => {
  req = { ...req, uri: _normalizeUrl(req.uri) }
  return path.join(folder, hash(req) + '.json')
}

// Support:
// - request.get('http://example.com', {foo: true})
// - request.get({uri: 'http://example.com', foo: true})
const _optionsParser = (url, options) => {
  if (!options) {
    options = url
  } else {
    options.uri = url
  }
  return options
}

const _normalizeUrl = _url => {
  _url = url.parse(_url)
  delete _url.port
  _url.host = url.hostname
  return url.format(_url)
}

module.exports = { _normalizeUrl, _optionsParser, cacheFile, hash, stringify }
