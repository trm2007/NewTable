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
} from '../NewTable/types/NewTableEventTypes';
import type { INewTableFilters, INewTableSorts } from '../NewTable/types/NewTableFilterTypes';
import type { TTActionsChangeModesStandart } from '../../constants/modeToChange';

import { useNewTableWrapperModesIds } from './composables/NewTableWrapperModesIds';
import { useNewTableWrapperFlatData } from './composables/NewTableWrapperFlatData';
import { useNewTablePagination } from './composables/NewTableWrapperPagination';
import { useNewTableWrapperWheelEvent } from './composables/NewTableWrapperWheelEvent';
import { useNewTableWrapperHeader } from './composables/NewTableWrapperHeader';

// import { ROW_MODES } from '../NewTable/constants/rowModes';
// import { NEW_TABLE_STANDART_ROW_ACTIONS } from './constants/standartActions';

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
  actionsChangeModes: TTActionsChangeModesStandart
}>();

const emit = defineEmits<{
  (e: 'row-action', event: INewTableRowActionEvent): void;
  // (e: 'change:cell-data', event: INewTableUpdateCellDataEvent): void;
  (e: 'change:column-width', event: INewTableChangeColumnWidthEvent): void;
}>();

const {
  modeIds,
  editingIds,
  expandedIds,
  checkedIds,
  switchOnModeForRow,
  switchOffModeForRow,
  switchOnModeForRowWithChildren,
  switchOffModeForRowWithChildren,
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
  () => modeIds.value
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
  const rowType = event.row.meta.rowType && event.row.meta.rowType in props.actionsChangeModes
    ? event.row.meta.rowType
    : 'default';

  if (!!props.actionsChangeModes?.[rowType]?.[event.name]) {
    // если вызвано какое-то действие - action == event.name
    // то это действие может установить определенный редим для строки
    // и, при необходимости, для её дочерних строк
    props.actionsChangeModes[rowType][event.name].on?.forEach(
      (modeName: string) => props.actionsChangeModes[rowType][event.name].withChildren
        ? switchOnModeForRowWithChildren(modeName, event.row)
        : switchOnModeForRow(modeName, event.row),
    );
    props.actionsChangeModes[rowType][event.name].off?.forEach(
      (modeName: string) => props.actionsChangeModes[rowType][event.name].withChildren
        ? switchOffModeForRowWithChildren(modeName, event.row)
        : switchOffModeForRow(modeName, event.row),
    );
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
      <!-- 
        @toggle:expand-row="toggleModeForRow(ROW_MODES.EXPANDED, $event)"
        @change:cell-data="$emit('change:cell-data', $event)"
      -->
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
        @change:columns-order="onChangeColumns"
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