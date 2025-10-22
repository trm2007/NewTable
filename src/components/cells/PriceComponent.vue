<template>
  <div class="cell">
    <template v-if="mode === 'edit'">
      <input
        type="number"
        v-model.number="localValue"
        @blur="commit"
      />
    </template>
    <template v-else>
      <span>{{ formatted }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  value: number | string
  mode?: 'view' | 'edit'
}>();

const emit = defineEmits(['update:value']);

const localValue = ref<number | string>(props.value as any);

watch(() => props.value, (v) => (localValue.value = v as any));

const formatted = computed(() => {
  const v = Number(props.value);

  if (Number.isNaN(v)) return '';

  return v.toLocaleString()
});

function commit() {
  emit('update:value', Number(localValue.value))
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
