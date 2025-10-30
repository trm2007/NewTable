<script setup lang="ts">
import { ref } from 'vue';

const splitDiv1 = ref<HTMLElement>();
const splitDiv2 = ref<HTMLElement>();

const delta = ref<number>(0);

let ticky = false;

function onResizerMouseDown(event: MouseEvent) {
  console.log('[onResizerMouseDown]', event);

  event.preventDefault();
  event.stopPropagation();

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(event: MouseEvent) {
  console.log('[onMouseMove]', event);

  event.preventDefault();
  event.stopPropagation();

  if (!splitDiv1 || !splitDiv2) {
    return;
  }

  delta.value += event.movementY;

  if (!ticky) {
    ticky = true;
    requestAnimationFrame(() => {
      const div1Height = splitDiv1.value.getBoundingClientRect().height;
      splitDiv1.value.style.height = `${div1Height + delta.value}px`;
      splitDiv1.value.style.flexBasis = `${div1Height + delta.value}px`;
      delta.value = 0;
      ticky = false;
    });
  }
}


function onMouseUp(event: MouseEvent) {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}
</script>


<template>
  <div class="new-splitter__wrapper">
    <div
      ref="splitDiv1"
      class="split-div1"
    >
      <slot name="div1" />
    </div>

    <div
      class="new-splitter__resizer"
      @mousedown="onResizerMouseDown"
    />

    <div
      ref="splitDiv2"
      class="split-div2"
    >
      <slot name="div2" />
    </div>
  </div>

</template>

<style lang="css" scoped>
.new-splitter__wrapper {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  flex-direction: column;

  box-sizing: border-box;
}

.new-splitter__wrapper .split-div1,
.new-splitter__wrapper .split-div2 {
  width: 100%;
  height: 100%;
  flex: 1 1;

  box-sizing: border-box;
}

.new-splitter__wrapper .new-splitter__resizer {
  width: 100%;
  height: 7px;
  background-color: red;
  border-top: 2px solid #c33;
  border-bottom: 2px solid #c33;
  border-left: none;
  border-right: none;
  box-sizing: border-box;

  flex: 0 0 7px;

  cursor: row-resize;
}
</style>