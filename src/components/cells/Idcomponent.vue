<template>
  <div class="cell">
    <span>{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: any
}>();
</script>

<style scoped>
.cell {
  padding: 4px;
}
</style>
