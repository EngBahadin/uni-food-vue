<template>
  <div class="min-h-screen bg-white lg:px-16 md:px-10 sm:px-8 px-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <p class="text-text-1-medium text-gray-100">Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <p class="text-text-1-medium text-error">Failed to load product. Please try again.</p>
    </div>

    <!-- Product Detail Content -->
    <div v-else-if="foodItem">
      <!-- Back Button -->
      <button type="button" class="w-fit rounded-2xl my-10 z-50" @click="handleBack">
        <Icon
          icon="mdi:arrow-left"
          class="cursor-pointer text-primary size-5 md:size-7 sm:size-6"
        />
      </button>

      <section class="flex justify-center flex-col gap-10">
        <!-- Product Image and Details -->
        <article class="flex md:justify-between flex-col md:flex-row">
          <div class="grid grid-flow-col gap-x-4">
            <!-- Product Image -->
            <div
              class="bg-primary rounded-3xl grid px-4 py-2 place-items-center lg:size-48 md:size-40 size-32"
            >
              <img :src="foodItem.image" :alt="foodItem.name" class="size-full object-contain" />
            </div>

            <!-- Product Details -->
            <div class="flex flex-col md:gap-3 gap-2">
              <h2
                class="lg:text-sub-heading-2-regular md:text-body-1-regular sm:text-body-2-regular text-body-4-regular text-primary w-fit"
              >
                {{ foodItem.name }}
              </h2>
              <p
                class="lg:text-body-3-semiBold md:text-body-4-semiBold sm:text-text-1-semiBold text-text-2-semiBold text-gray-100 w-fit"
              >
                {{ displayPrice }} IQD
              </p>
              <p
                class="lg:text-text-2-regular md:text-text-3-regular text-caption-1-regular text-black md:w-[80%]"
              >
                {{ foodItem.description }}
              </p>
            </div>
          </div>

          <!-- Quantity Controls and Add to Cart (Desktop) -->
          <div class="hidden md:flex md:flex-col items-end gap-y-8">
            <!-- Quantity Selector -->
            <div
              class="flex items-center justify-between gap-x-8 px-4 text-primary lg:text-text-1-medium sm:text-text-2-medium text-text-3-medium"
            >
              <span
                class="bg-gray-15 rounded-lg text-center lg:w-9 lg:h-8 sm:w-8 sm:h-7 w-6 h-6 lg:text-body-1-semiBold sm:text-body-2-semiBold text-text-1-semiBold cursor-pointer select-none flex items-center justify-center"
                @click="decreaseQuantity"
              >
                -
              </span>
              <p class="select-none">{{ quantity }}</p>
              <span
                class="bg-gray-15 rounded-lg text-center lg:w-9 lg:h-8 sm:w-8 sm:h-7 w-6 h-6 lg:text-body-1-semiBold sm:text-body-2-semiBold text-text-1-semiBold cursor-pointer select-none flex items-center justify-center"
                @click="increaseQuantity"
              >
                +
              </span>
              <Icon
                icon="mdi:delete"
                class="lg:w-8 lg:h-8 sm:w-6 sm:h-6 w-5 h-5 cursor-pointer"
                @click="handleBack"
              />
            </div>

            <!-- Add to Cart Button -->
            <button
              class="lg:h-14 lg:w-72 h-12 w-52 lg:text-text-1-semiBold text-text-2-semiBold rounded-xl bg-primary text-pure-white py-1"
              @click="addToCart"
            >
              Add to cart ({{ totalPrice }} IQD)
            </button>
          </div>
        </article>


        <!-- Customization Options -->
        <article
          class="grid md:gap-x-32 gap-x-12 md:gap-y-16 gap-y-6 md:w-[90%] mt-6 md:grid-cols-2 grid-cols-1 items-center pb-24 md:pb-14"
        >
          <!-- Size Selection (only if no fixed price) -->
          <article v-if="!foodItem.price" class="grid md:gap-y-8 gap-y-4">
            <h4 class="lg:text-body-4-medium text-pure-black text-text-1-medium">
              Choose Your Size
            </h4>
            <ul class="grid gap-y-3">
              <li
                v-for="size in foodItem.size_price"
                :key="size.id"
                class="flex justify-between items-center lg:text-text-1-regular text-text-2-regular"
              >
                <label class="relative flex items-center text-pure-black gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="size"
                    :checked="selectedSizeId === size.id"
                    @change="handleSizeSelection(size.id, size.price)"
                    class="rounded-lg border border-gray-75 appearance-none lg:size-6 size-5 checked:bg-primary checked:border-none"
                  />
                  <Icon
                    v-if="selectedSizeId === size.id"
                    icon="mdi:check"
                    class="absolute text-white lg:size-6 size-5 pointer-events-none"
                  />
                  {{ size.size }}
                </label>
                <span class="text-gray-75">{{ size.price }} IQD</span>
              </li>
            </ul>
          </article>

          <!-- Extras -->
          <article class="grid md:gap-y-8 gap-y-4">
            <h4 class="lg:text-body-4-medium text-pure-black text-text-1-medium">Extras</h4>
            <ul class="grid gap-y-3">
              <li
                v-for="(extra, index) in extras"
                :key="index"
                class="flex justify-between items-center lg:text-text-1-regular text-text-2-regular"
              >
                <label class="relative text-pure-black flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :value="extra.name"
                    v-model="selectedExtras"
                    class="rounded-lg border text-pure-black border-gray-75 appearance-none lg:size-6 size-5 checked:bg-primary checked:border-none"
                  />
                  <Icon
                    v-if="selectedExtras.includes(extra.name)"
                    icon="mdi:check"
                    class="absolute text-white lg:size-6 size-5 pointer-events-none"
                  />
                  {{ extra.name }}
                </label>
                <span class="text-gray-75">{{ extra.price }}</span>
              </li>
            </ul>
          </article>


          <!-- Drinks -->
          <article class="grid md:gap-y-8 gap-y-4">
            <h4 class="lg:text-body-4-medium text-pure-black text-text-1-medium">Drinks</h4>
            <ul class="grid gap-y-3">
              <li
                v-for="(drink, index) in drinks"
                :key="index"
                class="flex justify-between items-center lg:text-text-1-regular text-text-2-regular"
              >
                <label class="relative flex items-center text-pure-black gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :value="drink.name"
                    v-model="selectedDrinks"
                    class="rounded-lg border border-gray-75 appearance-none lg:size-6 size-5 checked:bg-primary checked:border-none"
                  />
                  <Icon
                    v-if="selectedDrinks.includes(drink.name)"
                    icon="mdi:check"
                    class="absolute text-white lg:size-6 size-5 pointer-events-none"
                  />
                  {{ drink.name }}
                </label>
                <span class="text-gray-75">{{ drink.price }}</span>
              </li>
            </ul>
          </article>
        </article>
      </section>

      <!-- Fixed Bottom Bar (Mobile) -->
      <div
        class="flex md:hidden items-end gap-y-8 fixed z-20 bottom-5 flex-row justify-center w-full right-0"
      >
        <!-- Quantity Selector (Mobile) -->
        <div
          class="flex items-center gap-x-4 text-primary lg:text-text-1-medium sm:text-text-2-medium text-text-3-medium border-primary border rounded-xl h-12 mx-4 order-[-1] px-4"
        >
          <span
            class="rounded-lg text-center w-6 h-6 text-text-1-semiBold cursor-pointer select-none flex items-center justify-center"
            @click="decreaseQuantity"
          >
            -
          </span>
          <p class="select-none">{{ quantity }}</p>
          <span
            class="rounded-lg text-center w-6 h-6 text-text-1-semiBold cursor-pointer select-none flex items-center justify-center"
            @click="increaseQuantity"
          >
            +
          </span>
        </div>

        <!-- Add to Cart Button (Mobile) -->
        <button
          class="h-12 w-52 text-text-2-semiBold rounded-xl bg-primary text-pure-white py-1"
          @click="addToCart"
        >
          Add to cart ({{ totalPrice }} IQD)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useFoodItemQuery } from '../../services/query'
import { extras, drinks } from '../../lib/utils'

const route = useRoute()
const router = useRouter()

const foodItemId = computed(() => {
  const id = route.params.id
  const numId = typeof id === 'string' ? parseInt(id, 10) : Number(id)
  return isNaN(numId) ? 0 : numId
})

const { data: foodItem, isLoading, error } = useFoodItemQuery(foodItemId)

// State
const MAX_COUNT = 99
const quantity = ref(1)
const selectedSizeId = ref<number | null>(null)
const selectedSizePrice = ref<number>(0)
const selectedExtras = ref<string[]>([])
const selectedDrinks = ref<string[]>([])

// Set default size if available (when no fixed price)
watch(
  () => foodItem.value,
  (item) => {
    if (item && !item.price && item.size_price && item.size_price.length > 0) {
      const firstSize = item.size_price[0]
      if (firstSize) {
        selectedSizeId.value = firstSize.id
        selectedSizePrice.value = firstSize.price
      }
    }
  },
  { immediate: true },
)

// Display price
const displayPrice = computed(() => {
  if (!foodItem.value) return 0
  if (selectedSizePrice.value) {
    return selectedSizePrice.value
  }
  return foodItem.value.price || 0
})

// Calculate total price
const totalPrice = computed(() => {
  let total = displayPrice.value


  // Add extras price (parse from "+500 IQD" format)
  selectedExtras.value.forEach((extraName) => {
    const extra = extras.find((e) => e.name === extraName)
    if (extra) {
      const price = parseInt(extra.price.replace(/[^0-9]/g, ''))
      total += price
    }
  })

  // Add drinks price
  selectedDrinks.value.forEach((drinkName) => {
    const drink = drinks.find((d) => d.name === drinkName)
    if (drink) {
      const price = parseInt(drink.price.replace(/[^0-9]/g, ''))
      total += price
    }
  })
  
  return total * quantity.value
})
// Handlers
const handleBack = () => {
  router.back()
}
const handleSizeSelection = (sizeId: number, sizePrice: number) => {
  // Toggle size selection
  if (selectedSizeId.value === sizeId) {
    selectedSizeId.value = null
    selectedSizePrice.value = 0
  } else {
    selectedSizeId.value = sizeId
    selectedSizePrice.value = sizePrice
  }
}
const increaseQuantity = () => {
  if (quantity.value < MAX_COUNT) {
    quantity.value++
  }
}
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
// Add to cart (placeholder)
const addToCart = () => {
  console.log('Add to cart:', {
    foodItem: foodItem.value,
    quantity: quantity.value,
    sizeId: selectedSizeId.value,
    sizePrice: selectedSizePrice.value,
    extras: selectedExtras.value,
    drinks: selectedDrinks.value,
    totalPrice: totalPrice.value,
  })
  // TODO: Implement actual cart functionality
}
</script>