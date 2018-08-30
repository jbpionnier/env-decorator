import 'reflect-metadata'

export interface Options {
  readonly type?: 'string' | 'number' | 'boolean'
  readonly required?: boolean
}

export type ValueType = string | boolean | number | undefined

interface PropertyMeta extends Options {
  readonly envVarName: string

  transform(value: string): ValueType
}

// tslint:disable-next-line:no-any
export type PropertyAnnotation = (target: { readonly constructor: any }, propertyKey: string) => void

const envMetadataKey = Symbol('env')

const transformMap = {
  string: (value: string): string => value,
  number: parseFloat,
  boolean: (value: string): boolean | undefined => {
    if (value === 'true') {return true}
    if (value === 'false') {return false}
  },
}

export function Env(param1?: string | Options, param2: Options = {}): PropertyAnnotation {
  return (target: object, propertyKey: string): void => {
    const envVarName = typeof param1 === 'string' ? param1 : propertyKey
    const options = typeof param1 === 'object' && param1 ? param1 : param2

    const existingEnvParams = Reflect.getMetadata(envMetadataKey, target) || {}

    Reflect.defineMetadata(envMetadataKey, {
      ...existingEnvParams,
      [propertyKey]: { envVarName, ...options, transform: transformMap[options.type || 'string'] },
    }, target)
  }
}

export function loadConfig<T>(Config: { new(): T }): T {
  // tslint:disable-next-line:no-any
  const config: any = new Config()
  const meta: { readonly [key: string]: PropertyMeta } = Reflect.getMetadata(envMetadataKey, config)

  const values = Object.keys(meta)
    .reduce((valuesAcc: { readonly [key: string]: string }, propertyKey: string) => {
      const propertyMeta = meta[propertyKey]
      const envValue = tryCast(process.env[propertyMeta.envVarName], propertyMeta)

      if (propertyMeta.required && envValue == undefined) {
        throw new Error(`Missing variable: ${propertyMeta.envVarName}`)
      }

      if (envValue == undefined) {
        return valuesAcc
      }

      return { ...valuesAcc, [propertyKey]: envValue }
    }, {})

  return Object.freeze({ ...config, ...values })
}

function tryCast(envValue: string | undefined, { envVarName, transform }: PropertyMeta): ValueType {
  if (envValue == undefined) {return}

  try {
    return transform(envValue)

  } catch (err) {
    throw new Error(`Failed to transform property ${envVarName} (value: ${envValue})`)
  }
}
