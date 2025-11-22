<template>
  <div class="p-10 flex flex-col bg-pure-white min-h-screen gap-y-14">
    <div>
      <h1 class="text-sub-heading-1-semiBold text-primary border-l-8 border-primary p-2 mb-4">
        {{ $t('about.title') }}
      </h1>
      <p class="text-body-3-regular text-black md:max-w-[70%]">
        {{ $t('about.description') }}
      </p>
    </div>
    <img
      :src="`${basePath}bro.png`"
      alt="Bro is ordering food"
      class="object-contain md:w-[412px] md:h-96 w-96 h-80 self-end"
    />
  </div>
</template>

<script setup lang="ts">
const basePath = import.meta.env.BASE_URL
</script>
