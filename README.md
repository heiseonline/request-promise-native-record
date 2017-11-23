# request-promise-native-record

`request-promise-native-record` allows unit tests that use `request`/`request-promise-native` without HTTP traffic. The first request is written to the hard disk. Further requests of this type are then handled from the hard disk. You may want to check the generated files into the VCS.

## Installation

```sh
yarn add --dev @heise/request-promise-native-record
```

or

```sh
npm install --save-dev @heise/request-promise-native-record
```

## Usage

`my-api.js`:

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
const record = require('./')
require('../my-api')

describe('my description', () => {
  it('should test my api', async () => {
    record.start({folder: '/tmp'})
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

