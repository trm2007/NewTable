<script setup lang="ts">
import { ref, watch } from 'vue';

import type { INewTableRow, INewTableRowCommonMeta } from '../NewTable/components/NewTableRow/types/NewTableRowTypes';
import type { INewTableColumn, INewTableHeaderSetting, INewTableHeaderSettings } from '../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type { INewTableCellActionData, INewTableCellNativeEvent, INewTableRowActionEvent } from '../NewTable/types/NewTableEventTypes';
import type { IChangeColumnSettingsEvent } from '../ColumnSettings/types';
import type { TNewTableActionsChangeModesStandart } from '../NewTable/types/NewTableActionsChangeModesTypes';
import type { INewContexMenuItem } from '../NewContextMenu/types';
import type { INewTableActions } from '../NewTable/types/NewTableActionTypes';
import type { INewReestrContexMenuItems } from './types/newReestrContexMenuItems';
import type { INewTableFilters, INewTableSorts } from '../NewTable/types/NewTableFilterTypes';

import { NEW_TABLE_STANDART_CELL_ACTIONS, NEW_TABLE_STANDART_ROW_ACTIONS, newTableStandartActions } from '../NewTableWrapper/constants/standartActions';
import { newTableStandartActionsChangeModes } from '../NewTableWrapper/constants/standartActionsChangeModes';
import { testActionsChangeModes } from '../../constants/actionsChangeModes';
import { columnsToCalc, generateExtraColumns, testColumns } from '../../constants/columns';
import { generateExtraColumnsSettings, testColumnsSettings } from '../../constants/testColumnsSettings';
import { NEW_TABLE_DEFAULT_MODE, NEW_TABLE_STANDART_ROW_MODES } from '../NewTable/constants/rowModes';
import { generateLargeTestData, TEST_DATA_ROW_TYPES } from '../../constants/testData';
import { findAllParentRowsFor, findParentRowsById, findParentRowWithChildIndexByChildRowId, findRowById } from '../../helpers/finders';
import { calcOwnSums, calcParentSums } from '../../helpers/calacSums';
import { testFilters } from '../../constants/filters';
import { testSorts } from '../../constants/sirts';

import NewTableWrapper from '../NewTableWrapper/NewTableWrapper.vue';
import NewContextMenu from '../NewContextMenu/NewContextMenu.vue';
import ColumnSettings from '../ColumnSettings/ColumnSettings.vue';
import NewReestrChangeRowParentDialog from './components/NewReestrChangeRowParentDialog/NewReestrChangeRowParentDialog.vue';
import { NEW_TABLE_DEFAULT_TYPE } from '../NewTable/constants/defaultRowType';
import { useNewReestrContextMenu } from './composables/NewReestrContextMenu';

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
      <ColumnSettings
        v-bind="{
          columns: props.initialColumns,
          columnsSettings,
        }"
        @change:column-settings="onChangeColumnSettings"
      />

      <NewTableWrapper
        ref="newTableWrapperRef"
        :key="timeStamp"
        :data="props.initialData"
        :columns="props.initialColumns"
        :columns-settings="columnsSettings"
        :initial-filters="props.initialFilters"
        :initial-sorts="props.initialSorts"
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
        <template v-slot:head[id]sort="idSlotProps">
          <span
            v-if="idSlotProps.sorts[idSlotProps.cellName]"
            style="color: green;"
          >{{ idSlotProps.cellName }} - sorted</span>
          <span
            v-else
            style="color: gray;"
          >{{ idSlotProps.cellName }} - unsorted</span>
        </template>

        <template v-slot:cell[id]="idSlotProps">
          <span style="color: red;">id[{{ idSlotProps.value }}]</span>
        </template>
        <template v-slot:cell[name]="nameSlotProps">
          <span style="color: blue;">{{ nameSlotProps.value }}</span>
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
        <span>{{ newTableWrapperRef.computedFlatData.length }}</span>
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
}


.new-reestr__data {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.new-reestr-settings {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.new-reestr-columns-settings__info {
  margin-left: 16px;
  display: flex;
  gap: 8px;
  display: flex;
  align-items: center;
}

dialog {
  z-index: 100;
  background-color: #eee;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 5px 1px #777;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

dialog p {
  padding: 0;
  margin: 0;
}

dialog form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

dialog form .dialog-buttons {
  display: flex;
  gap: 8px;
}
</style>
