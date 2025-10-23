<script setup lang="ts">
import { computed } from 'vue';

import type { INewTableRow, INewTableRowCommonMeta } from './types/NewTableRowTypes';
import type { INewTableColumn } from './types/INewTableHeadTypes';
import type { INewTableHeaderSetting } from './components/NewTableHeader/types/NewTableHeaderTypes';
import type {
  INewTableChangeFilterValue,
  INewTableChangeColumnsOrderEvent,
  INewTableChangeColumnWidthEvent,
  INewTableRowActionEvent,
  INewTableUpdateCellDataEvent
} from './types/NewTableEventTypes';
import type { INewTableFilters, INewTableSorts } from './types/NewTableFilterTypes';

import { ROW_MODES } from './constants/rowModes';

import NewTableHeader from './components/NewTableHeader/NewTableHeader.vue';
import NewTableRow from './components/NewTableRow/NewTableRow.vue';

const props = defineProps<{
  // подготовленные данные, которые полностьб будут отображаться
  data: INewTableRow[];
  // подгттовленные колокни - отсортированные и отображаемые
  columns: INewTableColumn[];
  // фильтры для полей-колонок данных
  filters?: INewTableFilters,
  // объект сортировки, потенциально для нескольких полей
  sorts?: INewTableSorts,
  // настройки колонок, тут важна установленная ширина
  columnsSettings: Record<string, INewTableHeaderSetting>;
  // габоры ID-шников в разлиных режимах отображения
  modeIds: Record<string, Set<number | string>>;
  // с какого номера в полном массиве данных начинается текущий набор данных
  startIndex: number;
  // кол-во отображаемых строк
  rowCount: number;
  // общие метаданные для строки данных, будут применяться, если такие не указаны для конкретной строки
  commonMeta?: INewTableRowCommonMeta
}>();

const emit = defineEmits<{
  (e: 'toggle:expand-row', rowId: number | string): void;
  (e: 'row-action', event: INewTableRowActionEvent): void;
  (e: 'update:cell-data', event: INewTableUpdateCellDataEvent): void;
  (e: 'change:columns-order', event: INewTableChangeColumnsOrderEvent): void;
  (e: 'change:column-width', event: INewTableChangeColumnWidthEvent): void;
  (e: 'change:filter-value', event: INewTableChangeFilterValue): void;
  (e: 'change:column-sort', event: INewTableSorts): void;
}>();

const computedModeIds = computed(() => props.modeIds);

const expandedRows = computed<Set<number | string>>(() => props.modeIds?.[ROW_MODES.EXPANDED]);

// const rowCount = computed<number>(() => props.data?.length || 1);
const rowCount = computed<number>(() => props.rowCount || 5);

const computedRowStyle = computed(
  () => ({
    height: `${100 / rowCount.value}% !important`,
    'max-height': `${100 / rowCount.value}% !important`,
    'min-height': `${100 / rowCount.value}% !important`,
    flex: `0 0 ${100 / rowCount.value}% !important`,
  })
);

function getModesForRow(row: INewTableRow): string[] | undefined {
  const result = Object.keys(computedModeIds.value || {}).filter(
    (mode) => computedModeIds.value?.[mode]?.has(row.data.id)
  );

  if (!result.includes(ROW_MODES.EDIT) && !result.includes(ROW_MODES.VIEW)) {
    result.push(ROW_MODES.VIEW);
  }

  return result;
}
</script>

<template>
  <div class="new-table">
    <NewTableHeader
      :visibleSortedColumns="columns"
      :localColumnsSettings="columnsSettings"
      :filters="filters"
      :sorts="sorts"
      :isNumberColumnShown="true"
      :isCheckboxColumnShown="true"
      :isExpandColumnShown="true"
      :isActionsColumnShown="true"
      @change:columns-order="$emit('change:columns-order', $event)"
      @change:column-width="$emit('change:column-width', $event)"
      @change:filter-value="emit('change:filter-value', $event)"
      @change:column-sort="emit('change:column-sort', $event)"
    />

    <div class="new-table__body">
      <NewTableRow
        v-for="(row, rowIndex) in data"
        :key="`${startIndex + rowIndex + 1}-${row.data.id}`"
        :row="row"
        :localColumnsSettings="columnsSettings"
        :isNumberColumnShown="true"
        :rowNumber="startIndex + rowIndex + 1"
        :isCheckboxColumnShown="true"
        :isExpandColumnShown="true"
        :isExpanded="expandedRows?.has(row.data.id)"
        :isActionsColumnShown="true"
        :visibleSortedColumns="columns"
        :modes="getModesForRow(row)"
        :commonMeta="props.commonMeta"
        :style="computedRowStyle"
        @toggle:expand-row="$emit('toggle:expand-row', $event)"
        @row-action="$emit('row-action', $event)"
        @update:cell-data="$emit('update:cell-data', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.new-table {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
  overflow-x: scroll;
}

.new-table :deep(.new-table__header) {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  color: #333;
  flex: 0 0;
  width: fit-content;
}

.new-table :deep(.new-table__header__row) {
  display: flex;
  box-sizing: border-box;
}

.new-table :deep(.new-table__header__cell) {
  padding: 8px;
  font-weight: bold;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  position: relative;
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__filter__icon.--active) {
  color: blue;
}

.new-table :deep(.new-table__header__cell__separator) {
  top: 0;
  width: 5px;
  right: -3px;
  height: 100%;
  cursor: col-resize;
  position: absolute;
  background-color: #333;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  z-index: 2;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}


.new-table__body {
  display: flex;
  flex-direction: column;
  flex: 1 1;
  min-height: 0;
  width: fit-content;
}

.new-table__body :deep(.new-table__body__row) {
  display: flex;
  border-bottom: 1px solid #eee;
  color: #555;
  box-sizing: border-box;
}

.new-table__body :deep(.new-table__cell) {
  padding: 8px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
}

.new-table :deep(.new-table__number-cell),
.new-table__body :deep(.new-table__number-cell) {
  padding: 8px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  text-align: center;
  position: sticky;
  left: 0;
}

.new-table :deep(.new-table__checkbox-cell),
.new-table__body :deep(.new-table__checkbox-cell) {
  padding: 8px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  text-align: center;
  position: sticky;
  left: 50px;
}

.new-table :deep(.new-table__expand-cell),
.new-table__body :deep(.new-table__expand-cell) {
  padding: 8px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  text-align: left;
  cursor: pointer;
  position: sticky;
  left: 100px;
}

.new-table :deep(.new-table__actions__cell),
.new-table__body :deep(.new-table__actions__cell) {
  padding: 8px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  text-align: center;
  position: sticky;
  right: 0;
}
</style>