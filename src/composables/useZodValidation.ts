import { ref } from 'vue'
import type { ZodSchema } from 'zod'
import { useI18n } from './useI18n'

export function useZodValidation<T extends Record<string, unknown>>(
  schemaOrFactory: ZodSchema<T> | (() => ZodSchema<T>),
) {
  const errors = ref<{ [key: string]: string | null }>({})

  const getSchema = (): ZodSchema<T> => {
    if (typeof schemaOrFactory === 'function') {
      return schemaOrFactory()
    }
    return schemaOrFactory
  }

  const validate = (data: T): boolean => {
    const schema = getSchema()
    const result = schema.safeParse(data)

    if (result.success) {
      errors.value = {}
      return true
    } else {
      const newErrors: { [key: string]: string | null } = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        newErrors[path] = issue.message
      })
      errors.value = newErrors
      return false
    }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const setError = (field: string, message: string) => {
    errors.value[field] = message
  }

  return {
    validate,
    errors,
    clearErrors,
    setError,
  }
}

