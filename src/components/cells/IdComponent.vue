<template>
  <div class="cell">
    <span>{{ props.value }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number | string
}>();
</script>

<style scoped>
.cell {
  padding: 4px;
}
</style>
