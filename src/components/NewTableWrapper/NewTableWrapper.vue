<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import type { INewTableRow, INewTableRowCommonMeta } from '../NewTable/components/NewTableRow/types/NewTableRowTypes';
import type { INewTableColumn, INewTableHeaderSetting } from '../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type {
  INewTableChangeFilterValue,
  INewTableChangeColumnsOrderEvent,
  INewTableChangeColumnWidthEvent,
  INewTableRowActionEvent,
} from '../NewTable/types/NewTableEventTypes';
import type { INewTableFilters, INewTableSorts } from '../NewTable/types/NewTableFilterTypes';
import type { INewTableActions } from '../NewTable/types/NewTableActionTypes';
import type { TNewTableActionsChangeModesStandart } from '../NewTable/types/NewTableActionsChangeModesTypes';

import { useNewTableWrapperModesIds } from './composables/NewTableWrapperModesIds';
import { useNewTableWrapperFlatData } from './composables/NewTableWrapperFlatData';
import { useNewTablePagination } from './composables/NewTableWrapperPagination';
import { useWheelEvent } from '../../composables/useWheelEvent';
import { useNewTableWrapperHeader } from './composables/NewTableWrapperHeader';

// import { ROW_MODES } from '../NewTable/constants/rowModes';
// import { NEW_TABLE_STANDART_ROW_ACTIONS } from './constants/standartActions';

import NewTable from '../NewTable/NewTable.vue';
import NewScroller from '../NewScroller/NewScroller.vue';
import { useNewTableWrapperFilteredData } from './composables/NewTableWrapperFilteredData';
import { useNewTableWrapperSortData } from './composables/NewTableWrapperSortData';
import { useDebounceFn } from '@vueuse/core';
import { useNewTableSlots } from '../NewTable/composables/NewTableSlots';
import { ROW_MODES } from '../NewTable/constants/rowModes';

const props = defineProps<{
  data: INewTableRow[];
  columns: INewTableColumn[];
  columnsSettings: Record<string, INewTableHeaderSetting>;
  commonMeta?: INewTableRowCommonMeta;
  initialFilters: INewTableFilters;
  initialSorts: INewTableSorts;
  actionsChangeModes: TNewTableActionsChangeModesStandart;
  // действия, доступные для каждой строки в зависимости от режима
  actions?: INewTableActions;
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
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
  toggleModeForRow,
  toggleModeForRowWithChildren,
} = useNewTableWrapperModesIds();

defineExpose({
  modeIds,
  editingIds,
  expandedIds,
  checkedIds,
  switchOnModeForRow,
  switchOffModeForRow,
  switchOnModeForRowWithChildren,
  switchOffModeForRowWithChildren,
  toggleModeForRow,
  toggleModeForRowWithChildren,
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
  changeColumnOrders,
  changeColumnWidths,
} = useNewTableWrapperHeader(
  () => props.columns,
  () => props.columnsSettings
);

const { onWheelEvent } = useWheelEvent(onNext, onPrevious);

const el = ref<InstanceType<typeof NewTable> | null>(null);

// TODO move to NewTableWrapperModesIds
const allRowIds = computed<(number | string)[]>(
  () => computedFlatData.value.map(
    (row: INewTableRow) => row.data.id,
  ),
);

// TODO move to NewTableWrapperModesIds
const isCheckedAll = computed<boolean>(() => {
  return (allRowIds.value || []).every(
    (currentRowId: string | number) => !!modeIds?.value?.[ROW_MODES.CHECKED]?.has(currentRowId),
  );
},
);

// TODO move to NewTableWrapperModesIds
const allRowWithChildrenIds = computed<(number | string)[]>(
  () => computedFlatData.value.filter(
    (row: INewTableRow) => !!row.children?.length,
  ).map(
    (row: INewTableRow) => row.data.id,
  ),
);

// TODO move to NewTableWrapperModesIds
const isExpandedAll = computed<boolean>(() => {
  return (allRowWithChildrenIds.value || []).every(
    (currentRowId: string | number) => !!modeIds?.value?.[ROW_MODES.EXPANDED]?.has(currentRowId),
  );
},
);

const onChangeFilterValueDebounced = useDebounceFn(
  (event: INewTableChangeFilterValue) => onChangeFilterValue(event),
  300
);

const {
  computedCellSlots,
  computedHeadSlots,
} = useNewTableSlots();

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
    // то это действие может установить определенный режим для строки
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

function onChangeColumnOrders(event: INewTableChangeColumnsOrderEvent) {
  if (
    !event.columnFrom
    || !event.columnTo
    || event.columnFrom === event.columnTo
  ) {
    return;
  }
  changeColumnOrders(event.columnFrom, event.columnTo);
}

function onChangeColumnWidths(event: INewTableChangeColumnWidthEvent) {
  changeColumnWidths(event.columnName, event.delta, event.currentWidth);
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

// TODO move to NewTableWrapperModesIds
function onToggleExpandAllRow() {
  if (isExpandedAll.value) {
    modeIds.value[ROW_MODES.EXPANDED] = null;
  } else {
    modeIds.value[ROW_MODES.EXPANDED] = new Set<number | string>(allRowWithChildrenIds.value);
  }
}

// TODO move to NewTableWrapperModesIds
function onToggleCheckAllRow() {
  if (isCheckedAll.value) {
    modeIds.value[ROW_MODES.CHECKED] = null;
  } else {
    modeIds.value[ROW_MODES.CHECKED] = new Set<number | string>(allRowIds.value);
  }
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
        :actions="actions"
        :isNumberColumnShown="isNumberColumnShown"
        :isCheckboxColumnShown="isCheckboxColumnShown"
        :isExpandColumnShown="isExpandColumnShown"
        :isExpandedAll="isExpandedAll"
        :isCheckedAll="isCheckedAll"
        v-bind="$attrs"
        @row-action="onAction"
        @change:columns-order="onChangeColumnOrders"
        @change:column-width="onChangeColumnWidths"
        @change:filter-value="onChangeFilterValueDebounced"
        @change:column-sort="onChangeColumnSort"
        @toggle:expand-all-row="onToggleExpandAllRow"
        @toggle:check-all-row="onToggleCheckAllRow"
      >
        <template
          v-for="slot in computedHeadSlots"
          :key="slot"
          #[slot]="slotProps"
        >
          <slot
            :name="slot"
            v-bind="slotProps"
          ></slot>
        </template>

        <template
          v-for="slot in computedCellSlots"
          :key="slot"
          #[slot]="slotProps"
        >
          <slot
            :name="slot"
            v-bind="slotProps"
          ></slot>
        </template>
      </NewTable>
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