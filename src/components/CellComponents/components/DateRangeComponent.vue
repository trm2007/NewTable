<template>
  <div class="cell">
    <input
      v-model="date1"
      type="date"
      @input="$emit('input:date1', date1)"
    >
    <input
      v-model="date2"
      type="date"
      @input="$emit('input:date2', date2)"
    >

    <button @click="commit">OK</button>
    <button @click="clear">Clear</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  value?: { date1: string, date2: string }
  // mode?: 'view' | 'edit'
}>();

const emit = defineEmits<{
  (e: 'update:value', value: { date1: string, date2: string }),
  (e: 'input', value: { date1: string, date2: string }),
  (e: 'input:date1', value: string),
  (e: 'input:date2', value: string),
}>();

const date1 = ref();
const date2 = ref();

watch(
  () => props.value,
  (v) => { date1.value = v.date1; date2.value = v.date2; },
);

watch(
  () => date1.value,
  (v) => emit('input', { date1: date1.value, date2: date2.value }),
);

watch(
  () => date2.value,
  (v) => emit('input', { date1: date1.value, date2: date2.value }),
);

function commit() {
  emit('update:value', { date1: date1.value, date2: date2.value });
}

function clear() {
  date1.value = null;
  date2.value = null;
  emit('update:value', null);
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
