<template>
  <DynamicLayout
    title="Change password"
    description="Please enter a new password"
  >
    <form @submit.prevent="handleSubmit" class="w-[80%] flex flex-col gap-y-2">
      <Input
        v-model="formData.current_password"
        type="password"
        name="current_password"
        label="Current Password"
        IconType="password"
        :errors="errors"
        placeholder="Old Password"
      />
      <Input
        v-model="formData.password"
        type="password"
        name="password"
        label="New Password"
        IconType="password"
        :errors="errors"
        placeholder="New Password"
      />

      <Input
        v-model="formData.re_password"
        type="password"
        name="re_password"
        label="Re-enter new password"
        IconType="password"
        :errors="errors"
        placeholder="Re enter New Password"
      />
      <button
        type="button"
        @click="navigateToForgotPassword"
        class="text-text-2-medium text-black hover:text-primary w-fit transition-all"
      >
        Forget my password
      </button>
      <div
        class="absolute bottom-16 z-10 w-[80%] flex flex-col items-center justify-center gap-y-3 right-[10%]"
      >
        <Button :is-pending="isPending">Update password</Button>
      </div>
    </form>
  </DynamicLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../../composables/useI18n'
import { useZodValidation } from '../../composables/useZodValidation'
import { createChangePasswordSchema } from '../../lib/formSchemas'
import { useChangePasswordMutation } from '../../../services/actions'
import { removeTokens } from '../../utils/auth'
import DynamicLayout from '../../components/auth/DynamicLayout.vue'
import Input from '../../components/auth/Input.vue'
import Button from '../../components/auth/Button.vue'

const router = useRouter()
const { t } = useI18n()
const { validate, errors, setError } = useZodValidation(() => createChangePasswordSchema(t))
const { mutate: submit, isPending, isError, error, isSuccess } = useChangePasswordMutation()

const formData = ref({
  current_password: '',
  password: '',
  re_password: '',
})

watch([isError, isSuccess], () => {
  if (isError.value && error.value) {
    setError('password', error.value.message)
  } else if (isSuccess.value) {
    console.log('Password Changed successfully')
    router.push('/profile')
  }
})

const navigateToForgotPassword = () => {
  removeTokens()
  router.push('/auth/forgot-password')
}

const handleSubmit = () => {
  if (validate(formData.value)) {
    const formDataObj = new FormData()
    formDataObj.append('current_password', formData.value.current_password)
    formDataObj.append('password', formData.value.password)
    formDataObj.append('re_password', formData.value.re_password)
    submit(formDataObj)
  }
}
</script>

