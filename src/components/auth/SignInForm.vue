<template>
  <form
    @submit.prevent="handleSubmit"
    class="w-[80%] text-text-1-medium gap-1 grid"
  >
    <Input
      v-model="formData.email"
      type="email"
      name="email"
      :label="$t('auth.email')"
      icon-type="email"
      :errors="errors"
      placeholder="eg. johndoe@example.com"
    />

    <Input
      v-model="formData.password"
      type="password"
      name="password"
      :label="$t('auth.password')"
      icon-type="password"
      :errors="errors"
      placeholder="Password"
    />
    <p v-if="isError && error" class="text-error text-caption-1-regular">
      {{ $t('auth.incorrectCredentials') }}
    </p>
    <RouterLink
      class="text-text-2-medium hover:text-primary text-black"
      to="/auth/forgot-password"
    >
      {{ $t('auth.forgotPassword') }}
    </RouterLink>
    <div
      class="absolute bottom-[5%] z-10 w-[80%] flex flex-col items-center justify-center gap-y-3 right-[10%]"
    >
      <Button :is-pending="isPending">{{ $t('auth.signIn') }}</Button>

      <article>
        <p
          class="md:text-text-2-regular sm:text-text-3-regular text-caption-1-regular inline text-black"
        >
          {{ $t('auth.doNotHaveAccount') }}
        </p>
        <RouterLink
          class="text-primary underline md:text-text-2-regular sm:text-text-3-regular text-caption-1-regular"
          to="/auth/signup"
        >
          {{ $t('auth.createAccount') }}
        </RouterLink>
      </article>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import { useI18n } from '../../composables/useI18n'
import { useZodValidation } from '../../composables/useZodValidation'
import { createSignInSchema } from '../../lib/formSchemas'
import { useSignInMutation } from '../../../services/actions'
import Input from './Input.vue'
import Button from './Button.vue'

const router = useRouter()
const { t } = useI18n()
const { validate, errors } = useZodValidation(() => createSignInSchema(t))
const { mutate: submit, isError, isSuccess, isPending, error } = useSignInMutation()

const formData = ref({
  email: '',
  password: '',
})

const handleSubmit = () => {
  if (validate(formData.value)) {
    const formDataObj = new FormData()
    formDataObj.append('email', formData.value.email)
    formDataObj.append('password', formData.value.password)
    submit(formDataObj)
  }
}

watch([isSuccess, isError], () => {
  if (isSuccess.value) {
    toast.success('Logged in successfully')
    router.push('/')
  } else if (isError.value && error.value) {
    toast.error(error.value.message || 'An error occurred')
  }
})
</script>

