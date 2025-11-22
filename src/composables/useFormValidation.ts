import { ref } from 'vue'
import type { FieldOptions } from '../../types'
import { createSchema } from '../../lib/schema'

export function useFormValidation() {
  const errors = ref<{ [key: string]: string | null }>({})

  const validate = (data: FormData, inputs: FieldOptions): boolean => {
    const schema = createSchema(inputs)
    const formObject = Object.fromEntries(data.entries())
    const result = schema.safeParse(formObject)

    if (result.success) {
      errors.value = {}
      return true
    } else {
      const newErrors: { [key: string]: string | null } = {}
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message
      })
      errors.value = newErrors
      return false
    }
  }

  return {
    validate,
    errors,
  }
}

