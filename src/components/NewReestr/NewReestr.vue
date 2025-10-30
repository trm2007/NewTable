<script setup lang="ts">
import { ref, watch } from 'vue';

import type { INewTableRow, INewTableRowCommonMeta } from '../NewTable/components/NewTableRow/types/NewTableRowTypes';
import type { INewTableColumn, INewTableHeaderSettings } from '../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type { INewTableCellNativeEvent, INewTableRowActionEvent } from '../NewTable/types/NewTableEventTypes';
import type { IChangeColumnSettingsEvent } from '../ColumnSettings/types';
import type { TNewTableActionsChangeModesStandart } from '../NewTable/types/NewTableActionsChangeModesTypes';
import type { INewContexMenuItem } from '../NewContextMenu/types';
import type { INewTableActions } from '../NewTable/types/NewTableActionTypes';
import type { INewReestrContexMenuItems } from './types/newReestrContexMenuItems';
import type { INewTableFilters, INewTableSorts } from '../NewTable/types/NewTableFilterTypes';

import { useNewReestrContextMenu } from './composables/NewReestrContextMenu';
import { useNewTableSlots } from '../NewTable/composables/NewTableSlots';

import { NEW_TABLE_STANDART_ROW_MODES } from '../NewTable/constants/rowModes';
import { NEW_TABLE_DEFAULT_TYPE } from '../NewTable/constants/defaultRowType';

import NewTableWrapper from '../NewTableWrapper/NewTableWrapper.vue';
import NewContextMenu from '../NewContextMenu/NewContextMenu.vue';
import ColumnSettings from '../ColumnSettings/ColumnSettings.vue';

const props = defineProps<{
  initialData: INewTableRow[];
  initialColumns: INewTableColumn[];
  initialColumnsSettings: INewTableHeaderSettings;
  initialFilters: INewTableFilters;
  initialSorts: INewTableSorts;
  initialActions: INewTableActions;
  initialActionsChangeModes: TNewTableActionsChangeModesStandart;
  initialContextMenuItems: INewReestrContexMenuItems;
  isNumberColumnShown: boolean;
  isCheckboxColumnShown: boolean;
  isExpandColumnShown: boolean;
  commonMeta?: INewTableRowCommonMeta;
}>();

const emit = defineEmits<{
  (e: 'change:column-settings', event: IChangeColumnSettingsEvent): void;
  (e: 'row-action', event: INewTableRowActionEvent): void;
  (e: 'select:item', menuIrem: INewContexMenuItem): void
}>();

const {
  generateContextMenuItemsWithPayload,
} = useNewReestrContextMenu();

const {
  computedCellSlots,
  computedHeadSlots,
} = useNewTableSlots();

const timeStamp = ref(Date.now());

const newTableWrapperRef = ref<typeof NewTableWrapper>();

const columnsSettings = ref<INewTableHeaderSettings>(
  JSON.parse(JSON.stringify(props.initialColumnsSettings))
);

const activeContextMenuItems = ref<INewContexMenuItem[]>([])

const activeContextMenuMouseEvent = ref<MouseEvent>(null)

watch(
  () => props.initialColumnsSettings,
  () => { columnsSettings.value = JSON.parse(JSON.stringify(props.initialColumnsSettings)); }
)

function onChangeColumnSettings(event: IChangeColumnSettingsEvent) {
  columnsSettings.value = {
    ...columnsSettings.value,
    [event.columnName]: event.columnsSettings,
  }

  emit('change:column-settings', event);
}

function onContextMenu(event: INewTableCellNativeEvent) {
  const rowType = event.row?.meta?.rowType || NEW_TABLE_DEFAULT_TYPE;

  activeContextMenuItems.value = props.initialContextMenuItems[rowType]
    || props.initialContextMenuItems[NEW_TABLE_DEFAULT_TYPE];

  if (!activeContextMenuItems.value) {
    return;
  }

  activeContextMenuItems.value =
    generateContextMenuItemsWithPayload(activeContextMenuItems.value, event);

  activeContextMenuMouseEvent.value = event.event;
}

function onSelectContextMenuItem(menuItem: INewContexMenuItem) {
  activeContextMenuMouseEvent.value = null;
  emit('select:item', menuItem);
}

function onDblClick(event) {
  newTableWrapperRef.value.switchOnModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, event.row);
}

defineExpose({
  deleteChangedRow: (idRow: number | string) => newTableWrapperRef.value?.deleteChangedRow(idRow),
});
</script>

<template>
  <div class="new-reestr">
    <div class="new-reestr__data">
      <div class="new-reestr__column-settings__wrapper">
        <ColumnSettings
          v-bind="{
            columns: props.initialColumns,
            columnsSettings,
          }"
          @change:column-settings="onChangeColumnSettings"
        />
      </div>

      <NewTableWrapper
        ref="newTableWrapperRef"
        class="new-reestr__new-table-wrapper"
        :key="timeStamp"
        :data="props.initialData"
        :columns="props.initialColumns"
        :columns-settings="columnsSettings"
        :filters="props.initialFilters"
        :sorts="props.initialSorts"
        :actions-change-modes="props.initialActionsChangeModes"
        :actions="props.initialActions"
        :isNumberColumnShown="props.isNumberColumnShown"
        :isCheckboxColumnShown="props.isCheckboxColumnShown"
        :isExpandColumnShown="props.isExpandColumnShown"
        :common-meta="props.commonMeta"
        @row-action="$emit('row-action', $event)"
        @dblclick.self="onDblClick"
        @contextmenu.self="onContextMenu"
        @change:position="activeContextMenuMouseEvent = null"
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
      </NewTableWrapper>
    </div>

    <div
      v-if="!!newTableWrapperRef"
      class="new-reestr-settings"
    >
      <div>
        <label>
          Str count:
          <input
            :value="newTableWrapperRef.rowCount"
            @change="newTableWrapperRef.setRowCount(Number(($event.target as HTMLInputElement).value || 5))"
          >
        </label>
      </div>

      <div class="new-reestr-columns-settings__info">
        <span>Total</span>
        <span>{{ newTableWrapperRef.fullFlatData.length }}</span>
      </div>

      <div class="new-reestr-columns-settings__info">
        <span>Total</span>
        <span>{{ newTableWrapperRef.filteredFlatData.length }}</span>
      </div>
    </div>

    <Teleport
      v-if="activeContextMenuMouseEvent"
      to="body"
    >
      <NewContextMenu
        :menuItems="activeContextMenuItems"
        :menuMouseEvent="activeContextMenuMouseEvent"
        @select:item="onSelectContextMenuItem"
        @close="activeContextMenuMouseEvent = null"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.new-reestr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  flex: 1 1;
  max-height: 100%;

  box-sizing: border-box;
}

.new-reestr__data {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 16px;

  flex: 1 1;
  min-height: 0;
  width: 100%;
}

.new-reestr__column-settings__wrapper {
  flex: 0 0;
  width: fit-content;
}

.new-reestr__new-table-wrapper {
  flex: 1 1;
  min-width: 0;
}

.new-reestr-settings {
  display: flex;
  justify-content: center;
  border-radius: 8px;
  background-color: #eee;
  width: 100%;
  text-align: center;
  padding: 8px;
  box-sizing: border-box;
  flex: 0 0;

  color: #333;
}

.new-reestr-columns-settings__info {
  margin-left: 16px;
  display: flex;
  gap: 8px;
  display: flex;
  align-items: center;
}
</style>
