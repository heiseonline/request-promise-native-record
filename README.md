# request-promise-native-record

When you write unit tests for APIs that consume remote web services, you want to test your application and not the network or remote web service. `request-promise-native-record` helps to record the answers of these web services in files and to play them back later.

If a recording does not exist or the environment variable `HTTP_MODE` is set to `record`, HTTP responses are written to files when you run your tests. You may want to check these files into your VCS. If the files are available, they will be used automatically for further test runs. From now on there is no network traffic.

## Installation

```sh
yarn add --dev @heise/request-promise-native-record
```

or

```sh
npm install --save-dev @heise/request-promise-native-record
```

## Usage

`lib/my-api.js`:

```js
const request = require('request-promise-native')

class Api {
  static getFoo() {
    return request.get('http://example.com/')
  }
}

module.exports = Api
```

`test/my-api.js`:

```js
const assert = require('assert')
const record = require('@heise/request-promise-native-record')

record.start({folder: '/tmp'})
const Api = require('../lib/my-api')

describe('my description', () => {
  it('should test my api', async () => {
    let response = await Api.getFoo() // 1. call: network request
    let response = await Api.getFoo() // 2. call: read from fs
    assert.ok(response.includes('Example Domain'))
  })
})
```

Generated file:

```sh
$ cat /tmp/14ba12b98882bca3bc00abff8735175a2544a9c1aa64794e85503198d84595b5.json 
"<!doctype html>\n<html>\n<head>[...]"
```

## Storing/Retrieving response headers, status codes and response body

To save the full response instead of just the response body, use the option [`resolveWithFullResponse`](https://github.com/request/request-promise#get-the-full-response-instead-of-just-the-body). The `Authorization` header is removed from the headers object before writing to the hard disk.

`lib/my-api.js`:

```js
const request = require('request-promise-native')

class Api {
  static getFoo() {
    return request.get('http://example.com/', {resolveWithFullResponse: true})
  }
}

module.exports = Api
```

## Limitations

- Currently only `request-promise-native` is supported as HTTP lib.
- Currently only `request.get()` is supported.
- The generated files are stored flat in the specified directory. You may have to clean up the files by yourself.
