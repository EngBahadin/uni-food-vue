<template>
  <form
    @submit.prevent="handleSubmit"
    class="flex flex-col w-[80%] mx-auto mt-6 text-text-1-medium"
  >
    <Input
      v-model="formData.username"
      name="username"
      :label="$t('profile.userProfile')"
      type="text"
      icon-type="user"
      :errors="errors"
      placeholder="e.g., John Doe"
    />
    <Input
      v-model="formData.email"
      type="email"
      name="email"
      :label="$t('auth.email')"
      icon-type="email"
      :errors="errors"
      placeholder="e.g., johndoe@example.com"
    />
    <Input
      v-model="formData.password"
      type="password"
      name="password"
      :label="$t('auth.password')"
      icon-type="password"
      :errors="errors"
      placeholder="Enter your password"
    />
    <Input
      v-model="formData.re_password"
      type="password"
      name="re_password"
      :label="$t('auth.confirmPassword')"
      icon-type="password"
      :errors="errors"
      placeholder="Re-enter your password"
    />
    <div
      class="absolute bottom-[2%] z-10 w-[80%] flex flex-col items-center justify-center gap-y-2 right-[10%]"
    >
      <Button :is-pending="isPending">
        {{ isPending ? $t('common.loading') : $t('auth.signUp') }}
      </Button>
      <p
        class="md:text-text-2-regular sm:text-text-3-regular text-caption-1-regular text-black"
      >
        {{ $t('auth.alreadyHaveAccount') }}
        <RouterLink
          class="text-primary md:text-text-2-semiBold sm:text-text-3-semiBold text-caption-1-semiBold underline"
          to="/auth/signin"
        >
          {{ $t('auth.signIn') }}
        </RouterLink>
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import { useI18n } from '../../composables/useI18n'
import { useZodValidation } from '../../composables/useZodValidation'
import { createSignUpSchema } from '../../lib/formSchemas'
import { useSignUpMutation } from '../../../services/actions'
import Input from './Input.vue'
import Button from './Button.vue'

const router = useRouter()
const { t } = useI18n()
const { validate, errors, setError } = useZodValidation(() => createSignUpSchema(t))
const { mutate: submit, isSuccess, isError, error, isPending } = useSignUpMutation()

const formData = ref({
  username: '',
  email: '',
  password: '',
  re_password: '',
})

watch([isError, isSuccess], () => {
  if (isError.value) {
    if (error.value && typeof error.value === 'object' && 'cause' in error.value) {
      const cause = (error.value as { cause?: Record<string, unknown> }).cause
      if (cause) {
        Object.entries(cause).forEach(([key, value]) => {
          const errorMessage = Array.isArray(value) && value.length > 0 ? (value[0] as string) : null
          if (errorMessage) {
            setError(key, errorMessage)
          }
        })
      }
    } else if (error.value) {
      toast.error(error.value.message || 'An unexpected error occurred.')
    }
  }

  if (isSuccess.value) {
    toast.success('Registration submitted successfully!')
    router.push('/auth/signup/check-email')
  }
})

const handleSubmit = () => {
  if (validate(formData.value)) {
    const formDataObj = new FormData()
    formDataObj.append('username', formData.value.username)
    formDataObj.append('email', formData.value.email)
    formDataObj.append('password', formData.value.password)
    formDataObj.append('re_password', formData.value.re_password)
    submit(formDataObj)
  }
}
</script>

