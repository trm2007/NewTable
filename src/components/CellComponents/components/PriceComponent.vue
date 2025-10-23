<template>
  <div class="cell">
    <template v-if="mode === 'edit'">
      <input
        v-model.number="localValue"
        type="number"
        @blur="commit"
      >
    </template>
    <template v-else>
      <span>
        {{ formatted }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  value?: number
  mode?: 'view' | 'edit'
}>();

const emit = defineEmits(['update:value']);

const localValue = ref<number>(props.value || 0);

watch(
  () => props.value,
  (v) => (localValue.value = v)
);

const formatted = computed(() => {
  const v = Number(props.value || 0);

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
