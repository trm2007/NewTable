<template>
  <div class="cell">
    <template v-if="mode === 'edit'">
      <input
        v-model="localValue"
        @blur="commit"
      />
    </template>
    <template v-else>
      <span>{{ value }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  value: any
  mode?: 'view' | 'edit'
}>();

const emit = defineEmits(['update:value']);

const localValue = ref(props.value);

watch(() => props.value, (v) => (localValue.value = v));

function commit() {
  emit('update:value', localValue.value)
}
</script>

<style scoped>
.cell {
  padding: 4px;
}

input {
  width: 100%;
  box-sizing: border-box;
}
</style>
