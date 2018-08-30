import { Env, loadConfig } from './'

export class Config {

  @Env({ required: true })
  readonly NODE_ENV: string

  @Env('NODE_ENV')
  readonly ENV: string

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
      DEBUG: true,
    })
  })

})
