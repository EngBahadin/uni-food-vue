<template>
  <div :class="errors?.[name] ? 'mb-0' : 'mb-2'" class="flex flex-col">
    <label :for="name" class="sm:text-text-1-medium text-black text-text-2-medium">
      {{ label }}
    </label>
    <div
      :class="[
        'relative flex items-center sm:text-text-2-medium text-text-3-medium bg-gray-15 rounded-[8px] w-full sm:h-12 h-9 overflow-hidden',
        errors?.[name]
          ? 'border border-error text-error'
          : 'focus-within:border focus-within:border-primary',
      ]"
    >
      <Icon
        v-if="IconType"
        :icon="iconMap[IconType]"
        :class="[
          'absolute sm:text-text-2-medium text-text-3-medium sm:h-6 sm:w-6 ml-3 h-4 w-4',
          errors?.[name] ? 'text-error' : isActive ? 'text-primary' : 'text-gray-75',
        ]"
      />
      <input
        :value="modelValue"
        @input="handleChange"
        @focus="isActive = true"
        @blur="isActive = false"
        :class="[
          'h-full outline-none bg-gray-15 text-gray-75 w-full pr-3 sm:pl-11 pl-9 placeholder:text-gray-75',
          errors?.[name] ? 'text-error' : 'focus-within:text-primary',
        ]"
        :type="passType"
        :placeholder="placeholder"
        :id="name"
        :name="name"
      />
      <Icon
        v-if="passType === 'password' && type === 'password'"
        icon="mdi:eye-off-outline"
        @click="togglePassType"
        aria-label="Hide password"
        :class="[
          'absolute sm:h-6 sm:w-6 h-4 w-4 right-3 cursor-pointer',
          errors?.[name] ? 'text-error' : 'text-gray-75',
        ]"
      />
      <Icon
        v-if="passType === 'text' && (name === 'password' || name === 'current_password')"
        icon="mdi:eye-outline"
        @click="togglePassType"
        :class="[
          'absolute sm:h-6 sm:w-6 h-4 w-4 right-3 cursor-pointer',
          errors?.[name] ? 'text-error' : 'text-gray-75',
        ]"
      />
    </div>
    <p
      v-if="errors?.[name]"
      class="text-error md:text-text-3-regular sm:text-caption-1-regular text-caption-2-regular"
    >
      {{ errors[name] }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { InputProps, IconType } from '../../../types'

const props = withDefaults(
  defineProps<{
    label: string
    name: string
    placeholder?: string
    type: string
    IconType?: IconType
    errors?: { [key: string]: string | null }
    modelValue?: string
  }>(),
  {
    placeholder: '',
    IconType: 'email',
    errors: () => ({}),
    modelValue: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:errors': [errors: Record<string, string>]
  change: [event: Event]
}>()

const passType = ref(props.type)
const isActive = ref(false)

const iconMap: Record<IconType, string> = {
  email: 'mdi:email-outline',
  password: 'mdi:lock-outline',
  user: 'mdi:account-outline',
}

const togglePassType = () => {
  passType.value = passType.value === 'password' ? 'text' : 'password'
}

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('change', e)
}
</script>
