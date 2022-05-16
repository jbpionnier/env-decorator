import { ENV_METADATA, PropertyMeta, ValueType } from './env.decorator'

export function loadConfig<T>(Config: new () => T): T {
  const config: T = new Config()
  const meta: { readonly [key: string]: PropertyMeta } = Reflect.getMetadata(ENV_METADATA, config)

  const values = Object.keys(meta)
    .reduce<T>((valuesAcc: T, propertyKey: string) => {
      const propertyMeta = meta[propertyKey]
      const envValue = tryCast(findEnvValue(propertyMeta), propertyMeta)

      checkValueRequired(propertyMeta, envValue)

      if (envValue == undefined) {
        return valuesAcc
      }

      // @ts-ignore
      valuesAcc[propertyKey] = envValue
      return valuesAcc
    }, config)

  return values
}

function checkValueRequired(propertyMeta: PropertyMeta, envValue: ValueType): void {
  if (propertyMeta.required && envValue == undefined) {
    throw new Error(`Missing variable: ${propertyMeta.envVarName.join(', ')}`)
  }
}

function findEnvValue(propertyMeta: PropertyMeta): string | undefined {
  return propertyMeta.envVarName.map((envVarName: string) => process.env[envVarName]).find((envValue?: string) => envValue != undefined)
}

function tryCast(envValue: string | undefined, { envVarName, transform }: PropertyMeta): ValueType {
  if (envValue == undefined) {
    return
  }

  try {
    return transform(envValue)
  } catch (err) {
    throw new Error(`Failed to transform property ${envVarName.join(', ')} (value: ${envValue})`)
  }
}
