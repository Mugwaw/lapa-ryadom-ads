<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: String, default: 'banner', validator: value => ['banner', 'sidebar'].includes(value) },
  width: { type: String, default: '' },
  height: { type: String, default: '' },
})

const dimensions = computed(() => ({
  width: props.width || (props.size === 'sidebar' ? '300px' : '728px'),
  height: props.height || (props.size === 'sidebar' ? '250px' : '90px'),
  maxWidth: '100%',
}))
</script>

<template>
  <div
    role="complementary"
    aria-label="Рекламное место"
    class="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-600 dark:bg-slate-800"
    :style="dimensions"
  >
    <span class="px-3 text-sm font-medium text-slate-500 dark:text-slate-300">Рекламное место</span>
  </div>
</template>
