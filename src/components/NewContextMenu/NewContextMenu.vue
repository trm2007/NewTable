<script setup lang="ts">
import { computed, ref } from 'vue';

import type {
  INewContexMenuItem,
  INewContextMenuXY,
} from './types';
import { useOutsideClickHandler } from '../../composables/useOutsideClickHandler';

const props = defineProps<{
  menuItems: INewContexMenuItem[];
  // объект события (нажатие правой кнопки мыши), которое вызвало меню
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
    class="new-context-menu"
  >
    <div
      v-for="menuItem in menuItems"
      :key="menuItem.actionName"
      class="new-menu-item"
      @click="emit('select:item', menuItem)"
    >
      {{ menuItem.label }}
    </div>
  </div>
</template>

<style scoped>
.new-context-menu {
  position: absolute;
  /* display: none; */
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.new-context-menu .new-menu-item {
  padding: 10px 15px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.new-context-menu .new-menu-item:hover {
  background-color: #f0f0f0;
}

@media (max-width: 600px) {
  .new-context-menu {
    width: 100%;
  }
}
</style>