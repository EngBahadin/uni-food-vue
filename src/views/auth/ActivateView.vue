<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <template v-if="isPending">
      <p class="md:text-body-3-medium sm:text-body-4-medium text-text-1-medium text-primary">
        Verifying Your Account .
      </p>
      <div class="lds-ellipsis text-primary">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </template>
    <template v-else-if="isError">
      <img
        src="/400-error.png"
        alt="400 Bad Request"
        class="object-contain sm:w-96 sm:h-96 h-80 w-80"
      />
      <p class="mt-14 text-primary sm:text-body-1-medium text-text-1-medium text-center">
        The link you entered is invalid <br />
        please try a valid verification link
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVerifyAccountMutation } from '../../../services/actions'

const route = useRoute()
const router = useRouter()
const { mutate: submit, isError, isPending, isSuccess } = useVerifyAccountMutation()

onMounted(() => {
  const uid = route.params.uid as string
  const token = route.params.token as string
  if (uid && token) {
    submit({ uid, token })
  }
})

watch(isSuccess, () => {
  if (isSuccess.value) {
    console.log('verified successfully')
    router.push('/')
  }
})
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
