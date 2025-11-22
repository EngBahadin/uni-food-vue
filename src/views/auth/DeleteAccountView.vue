<template>
  <DynamicLayout :title="$t('auth.deleteAccount')" :description="$t('auth.deleteAccountDescription')">
    <form @submit.prevent="handleSubmit" class="w-[80%] mt-[5%]">
      <Input
        v-model="formData.password"
        type="password"
        name="password"
        :label="$t('auth.password')"
        IconType="password"
        :errors="errors"
        @update:errors="setErrors"
        :placeholder="$t('auth.currentPassword')"
      />
      <div
        class="absolute bottom-16 z-10 w-[80%] flex flex-col items-center justify-center gap-y-3 right-[10%]"
      >
        <Button :is-pending="isPending">{{ $t('auth.deleteMyAccount') }}</Button>
      </div>
    </form>
  </DynamicLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../../composables/useI18n'
import { useZodValidation } from '../../composables/useZodValidation'
import { createDeleteAccountSchema } from '../../lib/formSchemas'
import { useDeleteAccountMutation } from '../../../services/actions'
import { toast } from 'vue-sonner'
import DynamicLayout from '../../components/auth/DynamicLayout.vue'
import Input from '../../components/auth/Input.vue'
import Button from '../../components/auth/Button.vue'

const router = useRouter()
const { t } = useI18n()
const { validate, errors, clearErrors, setError } = useZodValidation(() => createDeleteAccountSchema(t))
const { mutate: deleteAccount, isPending, isSuccess, isError, error } = useDeleteAccountMutation()

const formData = ref({
  password: '',
})

const setErrors = (newErrors: Record<string, string>) => {
  Object.keys(newErrors).forEach((key) => {
    errors.value[key] = newErrors[key] || null
  })
}

watch([isSuccess, isError], () => {
  if (isSuccess.value) {
    toast.warning(t('auth.accountDeleted'))
    router.push('/auth/signup')
  } else if (isError.value && error.value) {
    setError('password', error.value.message)
  }
})

const handleSubmit = () => {
  clearErrors()

  if (!validate(formData.value)) {
    return
  }

  const formDataObj = new FormData()
  formDataObj.append('password', formData.value.password)

  deleteAccount(formDataObj)
}
</script>

