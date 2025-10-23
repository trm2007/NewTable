<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

import type { INewTableColumn } from '../../types/INewTableHeadTypes';
import type { INewTableHeaderSetting } from './types/NewTableHeaderTypes';
import type {
  INewTableChangeFilterSearch,
  INewTableChangeColumnsOrderEvent,
  INewTableChangeColumnWidthEvent
} from '../../types/NewTableEventTypes';
import type { INewTableFilters } from '../../types/NewTableFilterTypes';

import { generateColumnWidths } from '../../helpers/generateColumnWidths';
import { useNewTableHeaderMouseWidth } from './composables/NewTableHeaderMouseWidth';

const props = defineProps<{
  visibleSortedColumns: INewTableColumn[];
  localColumnsSettings: Record<string, INewTableHeaderSetting>;
  // фильтры для полей-колонок данных
  filters?: INewTableFilters,
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
  isActionsColumnShown?: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle:expand-row'): void;
  (e: 'change:columns-order', event: INewTableChangeColumnsOrderEvent): void;
  (e: 'change:column-width', event: INewTableChangeColumnWidthEvent): void;
  (e: 'change:filter-value', event: INewTableChangeFilterSearch): void;
}>();


const { onMouseDown } = useNewTableHeaderMouseWidth(() => props.localColumnsSettings, emit)

const activeHeaderFilterName = ref<string | null>(null)

const conputedColumnWidths = computed<Record<string, string>>(
  () => generateColumnWidths(props.visibleSortedColumns, props.localColumnsSettings),
);

function onExpandCellClick() {
  emit('toggle:expand-row');
}

function onDragStart(event: DragEvent) {
  const target = event.target as HTMLElement;
  event.dataTransfer?.setData('text/plain', target.innerText);
  event.dataTransfer?.setData('column-key', target.getAttribute('data-column-key') || '');
}

// function onDragEnd(event: DragEvent) {
//   // console.log('[onDragEnd]', event);
// }

function onDragOver(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  const target = event.target as HTMLElement;
  const draggedColumnKey = event.dataTransfer?.getData('column-key');
  const droppedColumnKey = target.getAttribute('data-column-key');

  if (
    !draggedColumnKey
    || !droppedColumnKey
    || draggedColumnKey === droppedColumnKey
  ) {
    return;
  }

  emit('change:columns-order', { columnFrom: draggedColumnKey, columnTo: droppedColumnKey });
}

function onInputFilterSearch(key: string, searchStr: string) {
  emit('change:filter-value', { key, searchStr });
}

async function onClickOnHeader(key: string) {
  if (activeHeaderFilterName.value === key) {
    activeHeaderFilterName.value = null;
    return;
  }

  if (activeHeaderFilterName.value) {
    activeHeaderFilterName.value = null;
    await nextTick();
  }

  activeHeaderFilterName.value = key;
}

function getFilterTeleportName(key: string | null): string | undefined {
  return key ? `new-table-header-${key}-filter` : undefined;
}
</script>

<template>
  <div class="new-table__header">
    <div class="new-table__header__row">
      <div
        v-if="isNumberColumnShown"
        class="new-table__number-cell"
      />
      <div
        v-if="isCheckboxColumnShown"
        class="new-table__checkbox-cell"
      />
      <div
        v-if="isExpandColumnShown"
        class="new-table__expand-cell"
        @click="onExpandCellClick"
      />
      <div
        v-for="(header, index) in visibleSortedColumns"
        :key="index"
        class="new-table__header__cell"
        :style="{
          width: conputedColumnWidths[header.key],
          'min-width': conputedColumnWidths[header.key],
          'max-width': conputedColumnWidths[header.key],
          position: 'relative',
        }"
        :data-column-key="header.key"
        :draggable="true"
        @dragstart="onDragStart"
        @dragover="onDragOver"
        @drop="onDrop"
        @click="onClickOnHeader(header.key)"
      >
        {{ header.name }}

        <div
          v-if="!!activeHeaderFilterName && header.key in (filters || {})"
          :id="getFilterTeleportName(header.key)"
          :style="{
            position: 'absolute',
            zIndex: 3,
          }"
          @click.stop=""
        />

        <span
          class="new-table__header__cell__separator"
          @mousedown.stop.prevent="onMouseDown(header.key, $event)"
          @click.stop.prevent=""
        />
      </div>
      <div
        v-if="isActionsColumnShown"
        class="new-table__actions__cell"
      />
    </div>

    <teleport
      v-if="!!activeHeaderFilterName && activeHeaderFilterName in (filters || {})"
      :to="`#${getFilterTeleportName(activeHeaderFilterName)}`"
    >
      <div class="new-table__header__filter">
        <input
          @input="onInputFilterSearch(activeHeaderFilterName, (($event as InputEvent)?.target as HTMLInputElement).value || '')"
        >
      </div>
    </teleport>
  </div>
</template>
