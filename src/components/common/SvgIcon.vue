<template>
  <svg :class="iconClass" :style="iconCss">
    <use :xlink:href="icon" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { toRefs } from 'vue'

const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  iconCss: {
    type: Object,
    required: false,
  },
  iconClass: {
    type: Array,
    required: false,
  },
})

const { iconName } = toRefs(props)

const icon = computed(() => `#${iconName.value}`)
</script>

<style lang="scss" scoped></style>
