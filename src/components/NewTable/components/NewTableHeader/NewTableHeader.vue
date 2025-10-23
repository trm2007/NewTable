<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

library.add(faSort, faSortUp, faSortDown);

import type { INewTableColumn } from '../../types/INewTableHeadTypes';
import type { INewTableHeaderSetting } from './types/NewTableHeaderTypes';
import type {
  INewTableChangeFilterValue,
  INewTableChangeColumnsOrderEvent,
  INewTableChangeColumnWidthEvent
} from '../../types/NewTableEventTypes';
import type { INewTableFilters, INewTableSorts } from '../../types/NewTableFilterTypes';

import { generateColumnWidths } from '../../helpers/generateColumnWidths';
import { useNewTableHeaderMouseWidth } from './composables/NewTableHeaderMouseWidth';

const props = defineProps<{
  visibleSortedColumns: INewTableColumn[];
  localColumnsSettings: Record<string, INewTableHeaderSetting>;
  // фильтры для полей-колонок данных
  filters?: INewTableFilters,
  // объект сортировки, потенциально для нескольких полей
  sorts?: INewTableSorts,
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
  isActionsColumnShown?: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle:expand-row'): void;
  (e: 'change:columns-order', event: INewTableChangeColumnsOrderEvent): void;
  (e: 'change:column-width', event: INewTableChangeColumnWidthEvent): void;
  (e: 'change:filter-value', event: INewTableChangeFilterValue): void;
  (e: 'change:column-sort', event: INewTableSorts): void;
}>();


const { onMouseDown } = useNewTableHeaderMouseWidth(() => props.localColumnsSettings, emit)

const activeHeaderFilterName = ref<string | null>(null)

const conputedColumnWidths = computed<Record<string, string>>(
  () => generateColumnWidths(props.visibleSortedColumns, props.localColumnsSettings),
);

// пока сортировка реализована только по одному полю - первому встретившимуся в localSorts
const computedSortFieldName = computed<string>(() => Object.keys(props.sorts || {})[0]);

const computedSortDirection = computed<-1 | 0 | 1>(
  () => computedSortFieldName.value ? props.sorts[computedSortFieldName.value] || 0 : 0
);

const computedIconName = computed<string>(
  () => {
    let iconName = computedSortDirection.value === 1
      ? 'sort-up'
      : computedSortDirection.value === -1
        ? 'sort-down'
        : 'sort';
    return `fa-solid fa-${iconName}`;
  }
);

function getIconNameForField(fieldName: string) {
  if (fieldName === computedSortFieldName.value) {
    return computedIconName.value;
  }

  return 'fa-solid fa-sort';
}

function onExpandCellClick() {
  emit('toggle:expand-row');
}

function onDragStart(event: DragEvent) {
  const target = event.target as HTMLElement;
  event.dataTransfer?.setData('text/plain', target.innerText);
  event.dataTransfer?.setData('column-key', target.getAttribute('data-column-key') || '');
}

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

function onChangeFilterValue(key: string, value: string) {
  emit('change:filter-value', { key, value });
}

async function onClickOnFilter(key: string) {
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

function onClickOnSort(key: string) {
  if (!props.sorts?.[key]) {
    emit('change:column-sort', { [key]: 1 });
    return;
  }

  emit('change:column-sort', { [key]: props.sorts[key] === 1 ? -1 : 0 });
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
      >
        {{ header.name }}

        <FontAwesomeIcon
          v-if="Object.keys(props.filters || {}).includes(header.key)"
          icon="fa-solid fa-filter"
          class="icon"
          style="cursor: pointer;"
          @click="onClickOnFilter(header.key)"
        />

        <FontAwesomeIcon
          :icon="getIconNameForField(header.key)"
          class="icon"
          style="cursor: pointer;"
          @click="onClickOnSort(header.key)"
        />

        <div
          v-if="!!activeHeaderFilterName && header.key in (filters || {})"
          :id="getFilterTeleportName(header.key)"
          :style="{
            position: 'absolute',
            zIndex: 3,
          }"
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
        <component
          :is="props.filters[activeHeaderFilterName]?.component.name || 'input'"
          :value="props.filters[activeHeaderFilterName]?.currentValue"
          :filter="props.filters[activeHeaderFilterName]"
          v-bind="props.filters[activeHeaderFilterName]?.component.props || {}"
          v-on="{
            [props.filters[activeHeaderFilterName]?.component.changeEventName || 'change']:
              ($event) => onChangeFilterValue(activeHeaderFilterName, $event)
          }"
        />
      </div>
    </teleport>
  </div>
</template>
