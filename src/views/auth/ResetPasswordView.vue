<template>
  <div v-if="isLoading">
    <div class="flex flex-col items-center justify-center h-screen">
      <p
        class="md:text-body-3-medium sm:text-body-4-medium text-text-1-medium text-primary"
      >
        Validating token...
      </p>
      <div class="lds-ellipsis text-primary">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
  <DynamicLayout
    v-else-if="isTokenValid"
    title="Reset password"
    description="Please enter a new password"
  >
    <form @submit.prevent="handleSubmit" class="w-[80%] flex flex-col gap-y-3">
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

      <div
        class="absolute bottom-16 z-10 w-[80%] flex flex-col items-center justify-center gap-y-3 right-[10%]"
      >
        <Button :is-pending="isPending">Change my password</Button>
      </div>
    </form>
  </DynamicLayout>
  <div v-else-if="tokenError" class="flex flex-col items-center justify-center h-screen px-4">
    <p
      class="md:text-body-3-medium sm:text-body-4-medium text-text-1-medium text-red-600 text-center mb-4"
    >
      {{ tokenError }}
    </p>
    <p class="text-text-1-regular text-gray-600 text-center">
      Redirecting to forgot password page...
    </p>
  </div>
  <div v-else class="flex flex-col items-center justify-center h-screen">
    <p
      class="md:text-body-3-medium sm:text-body-4-medium text-text-1-medium text-primary"
    >
      Validating token...
    </p>
    <div class="lds-ellipsis text-primary">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '../../composables/useI18n'
import { useZodValidation } from '../../composables/useZodValidation'
import { createResetPasswordSchema } from '../../lib/formSchemas'
import { useResetPasswordMutation, useValidateTokenMutation } from '../../../services/actions'
import DynamicLayout from '../../components/auth/DynamicLayout.vue'
import Input from '../../components/auth/Input.vue'
import Button from '../../components/auth/Button.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { validate, errors, setError } = useZodValidation(() => createResetPasswordSchema(t))
const { mutate: submit, isPending, isError, error, isSuccess } = useResetPasswordMutation()

const formData = ref({
  password: '',
  re_password: '',
})

const isTokenValid = ref(false)
const tokenError = ref<string | null>(null)

const {
  mutate: validateTokenMutate,
  isPending: isLoading,
  isSuccess: isTokenValidSuccess,
  isError: isTokenError,
  error: tokenValidationError,
} = useValidateTokenMutation()

watch(isTokenValidSuccess, (success) => {
  if (success) {
    isTokenValid.value = true
    tokenError.value = null
  }
})

watch(isTokenError, (isErr) => {
  if (isErr) {
    console.error('Token validation error:', tokenValidationError.value)
    tokenError.value = tokenValidationError.value?.message || 'Invalid or expired token'
    setTimeout(() => {
      router.push('/auth/forgot-password')
    }, 3000)
  }
})

onMounted(() => {
  const uid = route.params.uid as string
  const token = route.params.token as string
  
  console.log('Reset password route params:', { uid, token, fullPath: route.fullPath })
  
  if (!uid || !token) {
    console.error('Missing uid or token:', { uid, token })
    tokenError.value = 'Missing uid or token in URL'
    setTimeout(() => {
      router.push('/auth/forgot-password')
    }, 2000)
    return
  }
  
  console.log('Validating token with:', { uid, token })
  validateTokenMutate({ uid, token })
})

watch([isError, isSuccess], () => {
  if (isError.value && error.value) {
    setError('password', error.value.message)
  } else if (isSuccess.value) {
    console.log('Password reset successfully')
    router.push('/')
  }
})

const handleSubmit = () => {
  const uid = route.params.uid as string
  const token = route.params.token as string

  if (validate(formData.value)) {
    const formDataObj = new FormData()
    formDataObj.append('password', formData.value.password)
    formDataObj.append('re_password', formData.value.re_password)
    formDataObj.append('uid', uid)
    formDataObj.append('token', token)
    submit(formDataObj)
  }
}
</script>

<style scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: currentColor;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>

