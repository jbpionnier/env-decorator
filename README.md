# Env Decorator

[![npm version](https://badge.fury.io/js/env-decorator.svg)](https://badge.fury.io/js/env-decorator)
[![Build Status](https://travis-ci.org/jbpionnier/env-decorator.svg?branch=master)](https://travis-ci.org/jbpionnier/env-decorator)
[![npm](https://img.shields.io/npm/dm/env-decorator.svg)](https://npm-stat.com/charts.html?package=env-decorator)

Type your environment variables with decorators for environment based configurations

## :package: Installation

To install the module from npm:

```
npm install --save env-decorator
```

## :blue_book: Usage

**Config class**

```js
import { loadConfig, ENV } from 'env-decorator'

export class Config {
	
  @Env({ required: true })
  NODE_ENV: string

  // Use the 'number' or 'boolean' type
  @Env({ type: 'number' })
  PORT: number

  @Env()
  ELASTICSEARCH_URL: string

  @Env('APP_DEBUG', { type: 'boolean' })
  DEBUG: boolean = true
}

export const config = loadConfig(Config)
```

**Import**

```js
import * as elasticsearch from 'elasticsearch'
import { config } from './config'

const client = new elasticsearch.Client({
  host: config.ELASTICSEARCH_URL
})
```

## :memo: License

[MIT](http://opensource.org/licenses/MIT)