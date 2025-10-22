<script setup lang="ts">
import { computed, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import type {
  INewTableRow,
  INewTableRowAction,
  INewTableRowCommonMeta
} from '../../types/NewTableRowTypes';
import type { INewTableColumn } from '../../types/INewTableHeadTypes';
import type { INewTableHeaderSetting } from '../NewTableHeader/types/NewTableHeaderTypes';
import type {
  INewTableCellActionEvent,
  INewTableRowActionEvent,
  INewTableUpdateCellDataEvent
} from '../../types/NewTableEventTypes';

import { generateColumnWidths } from '../../helpers/generateColumnWidths';
import { ROW_MODES } from '../../constants/rowModes';
import { NEW_TABLE_DEFAULT_CELL_COMPONENT_NAME } from '../../constants/defaultComponentName';

const props = defineProps<{
  row: INewTableRow;
  localColumnsSettings: Record<string, INewTableHeaderSetting>;
  visibleSortedColumns: INewTableColumn[];
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
  isActionsColumnShown?: boolean;
  isExpanded?: boolean;
  rowNumber?: number;
  modes?: string[];
  commonMeta?: INewTableRowCommonMeta;
}>();

const emit = defineEmits<{
  (e: 'toggle:expand-row', rowId: number | string): void;
  (e: 'row-action', event: INewTableRowActionEvent): void;
  (e: 'update:cell-data', event: INewTableUpdateCellDataEvent): void;
  (e: 'cell-action', event: INewTableCellActionEvent): void;
}>();

const iconForExpandCell = computed(() => {
  if (!props.row?.children?.length) {
    return 'fa-solid fa-file';
  }
  return props.isExpanded ? 'fa-solid fa-folder-open' : 'fa-solid fa-folder';
});

const conputedColumnWidths = computed<Record<string, string>>(
  () => generateColumnWidths(props.visibleSortedColumns, props.localColumnsSettings),
);

const actions = computed(() => props.row?.actions || {});

const computedCssClasses = computed(
  () => {
    if (props.row.meta.class) {
      return props.row.meta.class;
    }
    if (props.row.meta?.rowType) {
      return props.commonMeta?.class?.[props.row.meta.rowType] || '';
    }

    return '';
  }
);

let localRow: INewTableRow = JSON.parse(JSON.stringify(props.row));

watch(
  () => props.row,
  (newRow) => {
    localRow = JSON.parse(JSON.stringify(newRow));
  },
);

function onExpandCellClick() {
  if (!props.row?.children?.length) {
    return;
  }
  emit('toggle:expand-row', props.row.data.id);
}

function getComponentName(header: INewTableColumn, rowType?: string | number) {
  if (!header?.components) {
    return NEW_TABLE_DEFAULT_CELL_COMPONENT_NAME;
  }

  if (!rowType) {
    return header.components.default?.name || NEW_TABLE_DEFAULT_CELL_COMPONENT_NAME;
  }

  return header.components[rowType]?.name || NEW_TABLE_DEFAULT_CELL_COMPONENT_NAME;
}

function checkIsActionEnabled(action: INewTableRowAction) {
  if (!action.modes?.length) {
    return true;
  }

  if (!props.modes?.length) {
    return false;
  }

  return action.modes.some((mode: string) => !!props.modes?.includes(mode));
}

function getComponentProps(header: INewTableColumn, rowType?: string | number) {
  if (!header?.components) {
    return {};
  }

  if (!rowType) {
    return header.components.default?.props || {};
  }

  return header.components[rowType]?.props || {};
}

function onCellUpdate(key: string, value: unknown) {
  localRow.data[key] = value
  emit('update:cell-data', {
    key,
    value,
    row: props.row,
  });
}

function onCellAction(key: string, value: unknown) {
  emit('cell-action', {
    key,
    row: props.row,
    value,
  });
}
</script>

<template>
  <div
    class="new-table__body__row"
    :class="computedCssClasses"
  >
    <div
      v-if="isNumberColumnShown"
      class="new-table__number-cell"
    >
      {{ rowNumber }}
    </div>

    <div
      v-if="isCheckboxColumnShown"
      class="new-table__checkbox-cell"
    >
      <input
        :value="props.modes?.includes(ROW_MODES.CHECKED)"
        :checked="props.modes?.includes(ROW_MODES.CHECKED)"
        type="checkbox"
        @change="$emit('row-action', {
          name: 'check',
          row: localRow,
          value: (($event as InputEvent).target as HTMLInputElement)?.checked,
        })"
      >
    </div>

    <div
      v-if="isExpandColumnShown"
      class="new-table__expand-cell"
      :style="{
        paddingLeft: row.__level ? `${row.__level * 16}px` : '',
      }"
      @click="onExpandCellClick"
    >
      <FontAwesomeIcon
        :icon="iconForExpandCell"
        class="icon"
      />
    </div>

    <div
      v-for="(header, cellIndex) in visibleSortedColumns"
      :key="cellIndex"
      class="new-table__cell"
      :style="{
        width: conputedColumnWidths[header.key],
        'min-width': conputedColumnWidths[header.key],
        'max-width': conputedColumnWidths[header.key],
      }"
    >
      <component
        :is="getComponentName(header, row.meta.rowType || props.commonMeta?.rowType)"
        v-if="header?.components"
        :value="row.data[header.key]"
        :row="row"
        :column="header"
        :mode="props.modes?.includes(ROW_MODES.EDIT) ? ROW_MODES.EDIT : ROW_MODES.VIEW || ROW_MODES.VIEW"
        v-bind="getComponentProps(header, row.meta.rowType || props.commonMeta?.rowType)"
        @update:value="onCellUpdate(header.key, $event)"
        @cell-action="onCellAction(header.key, $event)"
      />
      <span v-else>{{ row.data[header.key] }}</span>
    </div>

    <div
      v-if="isActionsColumnShown"
      class="new-table__actions__cell"
    >
      <template v-for="(action, actionKey) in actions">
        <FontAwesomeIcon
          v-if="checkIsActionEnabled(action)"
          :key="actionKey"
          :icon="action.icon || 'fa-solid fa-circle-info'"
          class="icon new-table__action-icon"
          :title="action.label || action.eventName"
          @click="$emit('row-action', { name: action.eventName, row: localRow })"
        />
      </template>
    </div>
  </div>
</template>
