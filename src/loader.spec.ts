import { Env, loadConfig } from './'

export class Config {

  @Env({ required: true })
  readonly NODE_ENV: string

  @Env('NODE_ENV')
  readonly ENV: string

  @Env(['FOO', 'NODE_ENV'])
  readonly APP_ENV: string

  @Env('DEBUG')
  readonly DEBUG: boolean = true

}

describe('env-decorator', () => {

  let config: Config

  beforeAll(() => {
    config = loadConfig<Config>(Config)
  })

  test('check config', () => {
    expect(config).toEqual({
      NODE_ENV: 'test',
      ENV: 'test',
      APP_ENV: 'test',
      DEBUG: true,
    })
  })

})
