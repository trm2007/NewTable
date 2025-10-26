<script setup lang="ts">
import { computed, ref } from 'vue';

import type {
  INewContexMenuItem,
  INewContextMenuXY,
} from './types';
import { useOutsideClickHandler } from '../../composables/useOutsideClickHandler';

const props = defineProps<{
  menuItems: INewContexMenuItem[];
  // событие (нажатие правой кнопки мыши), которое вызвало меню
  menuMouseEvent: MouseEvent;
}>()

const emit = defineEmits<{
  (el: 'select:item', menuIrem: INewContexMenuItem): void
  (e: 'close'): void;
}>()

const xy = computed<INewContextMenuXY>(
  () => ({
    x: props.menuMouseEvent.clientX,
    y: props.menuMouseEvent.clientY,
  })
);

const menu = ref<HTMLElement>();

useOutsideClickHandler(
  () => menu.value,
  onClose,
)

function onClose() {
  emit('close');
}
</script>

<template>
  <div
    ref="menu"
    :style="{
      top: `${xy.y}px`,
      left: `${xy.x}px`,
      position: 'fixed',
    }"
    class="new-table-contextmenu"
  >
    <ul>
      <li
        v-for="menuItem in menuItems"
        :key="menuItem.actionName"
        @click="emit('select:item', menuItem)"
      >
        {{ menuItem.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.new-table-contextmenu {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0px 0px 8px 0px #aaa;
  color: #333;
  z-index: 2;
}

.new-table-contextmenu ul {
  padding: 0;
  margin: 0;
}

.new-table-contextmenu li {
  cursor: pointer;
  list-style: none;
}
</style>