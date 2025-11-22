<template>
  <DynamicLayout
    title="Forgot password"
    description="Enter your email to reset your password"
  >
    <form @submit.prevent="handleSubmit" class="w-[80%] mt-[5%]">
      <Input
        v-model="formData.email"
        type="email"
        name="email"
        label="Email"
        IconType="email"
        :errors="errors"
        placeholder="eg. johndoe@example.com"
      />
      <div
        class="absolute bottom-16 z-10 w-[80%] flex flex-col items-center justify-center gap-y-3 right-[10%]"
      >
        <Button :is-pending="isPending">Continue</Button>
      </div>
    </form>
  </DynamicLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../../composables/useI18n'
import { useZodValidation } from '../../composables/useZodValidation'
import { createForgotPasswordSchema } from '../../lib/formSchemas'
import { useForgotPasswordMutation } from '../../../services/actions'
import DynamicLayout from '../../components/auth/DynamicLayout.vue'
import Input from '../../components/auth/Input.vue'
import Button from '../../components/auth/Button.vue'

const router = useRouter()
const { t } = useI18n()
const { validate, errors, setError } = useZodValidation(() => createForgotPasswordSchema(t))
const { mutate: submit, isPending, isSuccess, isError, error } = useForgotPasswordMutation()

const formData = ref({
  email: '',
})

const handleSubmit = () => {
  if (validate(formData.value)) {
    const formDataObj = new FormData()
    formDataObj.append('email', formData.value.email)
    submit(formDataObj)
  }
}

watch([isSuccess, isError], () => {
  if (isSuccess.value) {
    console.log('Submitted successfully')
    router.push('/auth/check-email')
  } else if (isError.value && error.value) {
    setError('email', error.value.message)
  }
})
</script>

