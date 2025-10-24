<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import type { INewTableRow, INewTableRowCommonMeta } from '../NewTable/types/NewTableRowTypes';
import type { INewTableColumn } from '../NewTable/types/INewTableHeadTypes';
import type { INewTableHeaderSetting } from '../NewTable/components/NewTableHeader/types/NewTableHeaderTypes';
import type {
  INewTableChangeFilterValue,
  INewTableChangeColumnsOrderEvent,
  INewTableChangeColumnWidthEvent,
  INewTableRowActionEvent,
  INewTableUpdateCellDataEvent
} from '../NewTable/types/NewTableEventTypes';
import type { INewTableFilters, INewTableSorts } from '../NewTable/types/NewTableFilterTypes';

import { useNewTableWrapperModesIds } from './composables/NewTableWrapperModesIds';
import { useNewTableWrapperFlatData } from './composables/NewTableWrapperFlatData';
import { useNewTablePagination } from './composables/NewTableWrapperPagination';
import { useNewTableWrapperWheelEvent } from './composables/NewTableWrapperWheelEvent';
import { useNewTableWrapperHeader } from './composables/NewTableWrapperHeader';

import { ROW_MODES } from '../NewTable/constants/rowModes';
import { NEW_TABLE_STANDART_ACTIONS } from './constants/standartActions';

import NewTable from '../NewTable/NewTable.vue';
import NewScroller from '../NewScroller/NewScroller.vue';
import { useNewTableWrapperFilteredData } from './composables/NewTableWrapperFilteredData';
import { useNewTableWrapperSortData } from './composables/NewTableWrapperSortData';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps<{
  data: INewTableRow[];
  columns: INewTableColumn[];
  columnsSettings: Record<string, INewTableHeaderSetting>;
  commonMeta?: INewTableRowCommonMeta;
  initialFilters: INewTableFilters;
  initialSorts: INewTableSorts;
}>();

const emit = defineEmits<{
  (e: 'row-action', event: INewTableRowActionEvent): void;
  (e: 'update:cell-data', event: INewTableUpdateCellDataEvent): void;
  (e: 'change:column-width', event: INewTableChangeColumnWidthEvent): void;
}>();

const {
  modeIds,
  editingIds,
  expandedIds,
  checkedIds,
  switchOnModeForRow,
  switchOffModeForRow,
  toggleModeForRow
} = useNewTableWrapperModesIds();

defineExpose({
  editingIds,
  expandedIds,
  checkedIds,
})

const {
  filters,
  computedFilteredData,
} = useNewTableWrapperFilteredData(
  () => props.data,
  () => props.initialFilters,
);

const {
  sorts,
  sortedData,
} = useNewTableWrapperSortData(
  () => computedFilteredData.value,
  () => props.initialSorts,
);

const {
  computedFlatData,
  computedOnlyExpandedFlatData,
} = useNewTableWrapperFlatData(
  () => sortedData.value,
  () => expandedIds.value
);

const {
  startIndex,
  rowCount,
  computedOnlyExpandedFlatDataToView,
  setRowCount,
  onPrevious,
  onNext
} = useNewTablePagination(
  () => computedFlatData.value,
  () => computedOnlyExpandedFlatData.value,
);

const {
  localColumnsSettings,
  computedColumnsSortByOrderVisible,
  changeColumnsOrder,
  changeColumnsWidth,
} = useNewTableWrapperHeader(
  () => props.columns,
  () => props.columnsSettings
);

const { onWheelEvent } = useNewTableWrapperWheelEvent(onNext, onPrevious);

const el = ref<InstanceType<typeof NewTable> | null>(null);

const onChangeFilterValueDebounced = useDebounceFn(
  (event: INewTableChangeFilterValue) => onChangeFilterValue(event),
  300
);

onMounted(() => {
  if (!el.value?.$el) return;
  const element = el.value.$el as HTMLElement;
  element.addEventListener('wheel', onWheelEvent, { passive: true });
});

onBeforeUnmount(() => {
  if (!el.value?.$el) return;
  const element = el.value.$el as HTMLElement;
  element.removeEventListener('wheel', onWheelEvent);
});

function onAction(event: INewTableRowActionEvent) {
  // TODO нужно продумать такой функционал:
  // от родителя передается объект соответствия - имя дествия - устанавливаемый или снимаемый статцс
  // { actionName: { onMode, offMode } }
  if (event.name === NEW_TABLE_STANDART_ACTIONS.CHECK) {
    if (event.value) {
      switchOnModeForRow(ROW_MODES.CHECKED, event.row.data.id);
    } else {
      switchOffModeForRow(ROW_MODES.CHECKED, event.row.data.id);
    }
  }
  if (event.name === NEW_TABLE_STANDART_ACTIONS.EDIT) {
    switchOnModeForRow(ROW_MODES.EDIT, event.row.data.id);
  }
  if (event.name === NEW_TABLE_STANDART_ACTIONS.CANCEL) {
    switchOffModeForRow(ROW_MODES.EDIT, event.row.data.id);
  }
  if (event.name === NEW_TABLE_STANDART_ACTIONS.SAVE) {
    switchOffModeForRow(ROW_MODES.EDIT, event.row.data.id);
  }
  if (event.name === NEW_TABLE_STANDART_ACTIONS.DELETE) {
    switchOffModeForRow(ROW_MODES.EDIT, event.row.data.id);
  }
  if (event.name === NEW_TABLE_STANDART_ACTIONS.EXPAND) {
    switchOnModeForRow(ROW_MODES.EXPANDED, event.row.data.id);
  }

  emit('row-action', event);
}

function onChangeColumns(event: INewTableChangeColumnsOrderEvent) {
  if (
    !event.columnFrom
    || !event.columnTo
    || event.columnFrom === event.columnTo
  ) {
    return;
  }
  changeColumnsOrder(event.columnFrom, event.columnTo);
}

function onChangeColumnsWidth(event: INewTableChangeColumnWidthEvent) {
  changeColumnsWidth(event.columnName, event.delta, event.currentWidth);
}

function onChangeFilterValue(event: INewTableChangeFilterValue) {
  filters.value = {
    ...filters.value,
    [event.key]: {
      ...(filters.value[event.key] || {}),
      currentValue: event.value
    }
  }
}

function onChangeColumnSort(event: INewTableSorts) {
  sorts.value = event;
}
</script>

<template>
  <div>
    <div class="new-table-wrapper">
      <NewTable
        ref="el"
        :data="computedOnlyExpandedFlatDataToView"
        :columns="computedColumnsSortByOrderVisible"
        :columnsSettings="localColumnsSettings"
        :filters="filters"
        :sorts="sorts"
        :modeIds="modeIds"
        :startIndex="startIndex"
        :rowCount="rowCount"
        :commonMeta="props.commonMeta"
        @row-action="onAction"
        @toggle:expand-row="toggleModeForRow(ROW_MODES.EXPANDED, $event)"
        @change:columns-order="onChangeColumns"
        @update:cell-data="$emit('update:cell-data', $event)"
        @change:column-width="onChangeColumnsWidth"
        @change:filter-value="onChangeFilterValueDebounced"
        @change:column-sort="onChangeColumnSort"
      />
      <NewScroller
        :count="computedOnlyExpandedFlatData.length"
        :position="startIndex"
        :rowCount="rowCount"
        class="new-table__scroller"
        @chenge:position="(newPosition: number) => { startIndex = newPosition }"
      />
    </div>

    <div class="new-table-pagination">
      <div>
        <label>
          Str count:
          <input
            :value="rowCount"
            @change="setRowCount(Number(($event.target as HTMLInputElement).value || 5))"
          >
        </label>
      </div>
      <button
        :disabled="startIndex === 0"
        @click="onPrevious"
      >
        Previous
      </button>
      <button
        :disabled="startIndex + rowCount >= computedOnlyExpandedFlatData.length"
        @click="onNext"
      >
        Next
      </button>
      <div class="new-table-pagination__info">
        <span>Total</span>
        <span>{{ computedFlatData.length }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-table-wrapper {
  display: flex;
  padding: 16px;
  height: 50vh;
  width: 50vw;
  align-items: stretch;
  justify-content: flex-start;
}

.new-table__scroller {
  flex: 0 0;
}

.new-table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.new-table-pagination__info {
  margin-left: 16px;
  display: flex;
  gap: 8px;
  display: flex;
  align-items: center;
}
</style>