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
  <a
    href="https://ru.wikipedia.org/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Открыть Википедию в новой вкладке"
    class="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 text-left shadow-sm transition hover:border-brand-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:bg-slate-800"
    :style="dimensions"
  >
    <span class="flex min-w-0 items-center gap-3">
      <span aria-hidden="true" class="font-display text-4xl text-slate-800 dark:text-white">W</span>
      <span class="min-w-0">
        <span class="block text-sm font-bold text-slate-900 dark:text-white">Википедия</span>
        <span class="block text-xs text-slate-600 dark:text-slate-300">Свободная энциклопедия для любознательных</span>
      </span>
    </span>
    <span aria-hidden="true" class="shrink-0 text-lg text-brand-700 dark:text-brand-300">↗</span>
  </a>
</template>
