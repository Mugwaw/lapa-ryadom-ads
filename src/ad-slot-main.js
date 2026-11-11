import { createApp } from 'vue'
import AdSlot from './AdSlot.vue'

const target = document.getElementById('ad-slot')
if (target) createApp(AdSlot, { size: 'banner' }).mount(target)
