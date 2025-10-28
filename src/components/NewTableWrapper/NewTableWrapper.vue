<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

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
import { useNewTableWrapperFilteredData } from './composables/NewTableWrapperFilteredData';
import { useNewTableWrapperSortData } from './composables/NewTableWrapperSortData';
import { useDebounceFn } from '@vueuse/core';
import { useNewTableSlots } from '../NewTable/composables/NewTableSlots';
import { useNewTableWrapperExpanded } from './composables/NewTableWrapperExpanded';
import { useNewTableWrapperChecked } from './composables/NewTableWrapperChecked';

import { NEW_TABLE_DEFAULT_TYPE } from '../NewTable/constants/defaultRowType';

import NewTable from '../NewTable/NewTable.vue';
import NewScroller from '../NewScroller/NewScroller.vue';

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

const {
  isExpandedAll,
  toggleExpandAllRow,
} = useNewTableWrapperExpanded(
  () => modeIds.value,
  () => computedFlatData.value,
);

const {
  isCheckedAll,
  toggleCheckAllRow,
} = useNewTableWrapperChecked(
  () => modeIds.value,
  () => computedFlatData.value,
);

const { onWheelEvent } = useWheelEvent(onNext, onPrevious);

const onChangeFilterValueDebounced = useDebounceFn(
  (event: INewTableChangeFilterValue) => onChangeFilterValue(event),
  300
);

const {
  computedCellSlots,
  computedHeadSlots,
} = useNewTableSlots();

const el = ref<InstanceType<typeof NewTable> | null>(null);

const changedRows = ref<Record<string, INewTableRow>>({});

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
    : NEW_TABLE_DEFAULT_TYPE;

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

function onToggleExpandAllRow() {
  toggleExpandAllRow();
}

function onToggleCheckAllRow() {
  toggleCheckAllRow();
}

function onUpdateCellValue(localRow: INewTableRow) {
  changedRows.value[localRow.data.id] = localRow
}

function deleteChangedRow(idRow: number | string) {
  const {
    [idRow]: deletedRow,
    ...newChangedRows
  } = changedRows.value;
  changedRows.value = newChangedRows;
}

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

  rowCount,
  setRowCount,
  computedFlatData,

  changedRows,
  deleteChangedRow,
})
</script>

<template>
  <div>
    <div class="new-table-wrapper">
      <NewTable
        ref="el"
        :data="computedOnlyExpandedFlatDataToView"
        :changedRows="changedRows"
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
        @update:cell-value="onUpdateCellValue"
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
  </div>
</template>

<style scoped>
.new-table-wrapper {
  display: flex;
  height: 50vh;
  width: 50vw;
  align-items: stretch;
  justify-content: flex-start;
}

.new-table__scroller {
  flex: 0 0;
  border-top-left-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 0;
  background-color: var(--nt-scrollbar-background, #f5f5f5);
}
</style>