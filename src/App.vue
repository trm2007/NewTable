<script setup lang="ts">
import { computed, ref } from 'vue';

import type { INewTableRow } from './components/NewTable/types/NewTableRowTypes';
import type { INewTableColumn } from './components/NewTable/types/INewTableHeadTypes';
import type { INewTableHeaderSetting } from './components/NewTable/components/NewTableHeader/types/NewTableHeaderTypes';
import type {
  INewTableCellActionData,
  INewTableCellNativeEvent,
  INewTableRowActionEvent
} from './components/NewTable/types/NewTableEventTypes';
import type { IChangeColumnSettingsEvent } from './components/ColumnSettings/types';
import type { TNewTableActionsChangeModesStandart } from './components/NewTable/types/NewTableActionsChangeModesTypes';
import type { INewTableActions } from './components/NewTable/types/NewTableActionTypes';
import type { INewContexMenuItem } from './components/NewContextMenu/types';

import { NEW_TABLE_STANDART_CELL_ACTIONS, NEW_TABLE_STANDART_ROW_ACTIONS, newTableStandartActions } from './components/NewTableWrapper/constants/standartActions';
import { generateLargeTestData, TEST_DATA_ROW_TYPES } from './constants/testData';
import { columnsToCalc, columns as testColumns } from './constants/columns';
import { testColumnsSettings } from './constants/testColumnsSettings';
import { filters } from './constants/filters';
import { sorts } from './constants/sirts';
import { findAllParentRowsFor, findParentRowsById, findParentRowWithChildIndexByChildRowId, findRowById } from './helpers/finders';
import { calcChildSums, calcParentSums } from './helpers/calacSums';
import { newTableStandartActionsChangeModes } from './components/NewTableWrapper/constants/standartActionsChangeModes';

import NewTableWrapper from './components/NewTableWrapper/NewTableWrapper.vue';
import ColumnSettings from './components/ColumnSettings/ColumnSettings.vue';
import { ROW_MODES } from './components/NewTable/constants/rowModes';
import NewContextMenu from './components/NewContextMenu/NewContextMenu.vue';

interface INewTableChangeCellData {
  row: INewTableRow, // row
  key: string, // cell name
  value: unknown, // event data from cell component        
};

const data = ref<INewTableRow[]>([]);
const columns = ref<INewTableColumn[]>([]);
const columnsSettings = ref<Record<string, INewTableHeaderSetting>>({});

const timeStamp = ref(Date.now());

const newTableWrapperRef = ref<typeof NewTableWrapper>();

const actions = ref<INewTableActions>(newTableStandartActions)

const actionsChangeModes = ref<TNewTableActionsChangeModesStandart>(newTableStandartActionsChangeModes);

const activeContextMenuItems = ref<INewContexMenuItem[]>([])

const activeContextMenuMouseEvent = ref<MouseEvent>(null)

const activeDestinationRowId = ref<number>(null);

const activeSourceRow = ref<INewTableRow>(null);

const isDestinationRowIdDialogShown = ref<boolean>(false);

const checkedIds = computed<Set<number | string>>(() => newTableWrapperRef.value?.checkedIds);

function initData() {
  data.value = generateLargeTestData(20000);

  columns.value = testColumns;
  columnsSettings.value = testColumnsSettings;
  actionsChangeModes.value = {
    ...actionsChangeModes.value,
    default: {
      ...(actionsChangeModes.value.default || {}),
      [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
        on: [...(actionsChangeModes.value.default?.[NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]?.on || []), 'changed'],
        off: actionsChangeModes.value.default?.[NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]?.off || [],
      }
    },
  }

  timeStamp.value = Date.now();
}

function onSave(row: INewTableRow) {
  setRow(row);
}

function onDelete(event: INewTableRowActionEvent) {
  const confirmRes = confirm('Are you sure&');

  if (!confirmRes) {
    return;
  }

  const row: INewTableRow = event.row;

  const parentRowWithChildRowId = findParentRowWithChildIndexByChildRowId(event.row.data.id, data.value);

  const parenRows = findParentRowsById(row.data.id, data.value);
  parenRows?.splice(
    parenRows.findIndex(r => r.data.id === row.data.id),
    1
  );

  if (!row.children) {
    row.meta.rowType = TEST_DATA_ROW_TYPES.TASK;
  }

  if (parentRowWithChildRowId) {
    calcChildSums(parentRowWithChildRowId.parent, data.value, columnsToCalc);
    calcParentSums(parentRowWithChildRowId.parent, data.value, columnsToCalc);
  }
}

function setRow(row: INewTableRow) {
  const parenRows = findParentRowsById(row.data.id, data.value);

  if (!parenRows) {
    return;
  }

  parenRows?.forEach((r, index) => {
    if (r.data.id === row.data.id) {
      parenRows[index] = row;
    }
  });
}

function onRowAction(event: INewTableRowActionEvent) {
  switch (event.name) {
    case NEW_TABLE_STANDART_ROW_ACTIONS.SAVE:
      onSave(event.row);
      calcParentSums(event.row, data.value, columnsToCalc);
      break;
    case NEW_TABLE_STANDART_ROW_ACTIONS.DELETE:
      const parentRow = findParentRowWithChildIndexByChildRowId(event.row.data.id, data.value);
      onDelete(event);
      if (parentRow) {
        calcChildSums(parentRow.parent, data.value, columnsToCalc);
        calcParentSums(parentRow.parent, data.value, columnsToCalc);
      }
      break;
    case NEW_TABLE_STANDART_ROW_ACTIONS.CELL_ACTION:
      onCellAction(event);
      break;
    default:
      console.log('Unknown action:', event.name, 'for row:', event.row);
  }
}

function onCellAction(event: INewTableRowActionEvent) {
  const cellActionValue: INewTableCellActionData = event.value as INewTableCellActionData;

  switch (cellActionValue.name) {
    case NEW_TABLE_STANDART_CELL_ACTIONS.CHANGE_CELL:
      onChangeCellData({
        row: event.row, // row
        key: cellActionValue?.key, // cell name
        value: cellActionValue?.value, // event data from cell component        
      });
      break;
  }
}

function onChangeColumnSettings(event: IChangeColumnSettingsEvent) {
  columnsSettings.value = {
    ...columnsSettings.value,
    [event.columnName]: event.columnsSettings,
  }
}

function onChangeCellData(event: INewTableChangeCellData) {
  const row = findRowById(event.row.data.id, data.value);
  if (row) {
    row.data[event.key] = event.value;
  }
}

function onContextMenu(event: INewTableCellNativeEvent) {
  console.log('[onContextMenu]', event);

  activeContextMenuItems.value = [
    {
      label: 'Edit Row',
      actionName: 'edit-row',
      payload: event,
    },
    {
      label: 'Delete Row',
      actionName: 'delete-row',
      payload: event,
    },
    {
      label: 'Show Cell Info',
      actionName: 'cell-info',
      payload: event,
    },
    {
      label: 'Change row parent',
      actionName: 'change-row-parent',
      payload: event,
    },
  ];

  activeContextMenuMouseEvent.value = event.event;
}

function changeRowParent(sourceRow: INewTableRow, destinationRowId: number | string) {
  const destinationRow = findRowById(destinationRowId, data.value);

  if (!destinationRow) {
    alert('Warning! Wrong destinationRowId!');
    console.warn('[changeRowParent] Wrong destinationRowId', destinationRowId);
    return;
  }

  const sourceParentRow = findParentRowWithChildIndexByChildRowId(sourceRow.data.id, data.value);

  sourceParentRow.parent.children.splice(sourceParentRow.index, 1);

  if (!destinationRow.children) {
    destinationRow.children = [];
  }
  destinationRow.children.push(sourceRow);
  if (destinationRow.meta.rowType === TEST_DATA_ROW_TYPES.TASK) {
    destinationRow.meta.rowType = TEST_DATA_ROW_TYPES.SUB_STAGE;
  }
}

function onSelectContextMenuIte(menuItem: INewContexMenuItem) {
  console.log('[onSelectContextMenuIte]', menuItem);

  const payload: INewTableCellNativeEvent = menuItem.payload as INewTableCellNativeEvent;

  switch (menuItem.actionName) {
    case 'edit-row':
      newTableWrapperRef.value.switchOnModeForRow(ROW_MODES.EDIT, payload.row);
      break;
    case 'delete-row':
      onDelete({ name: 'delete', row: payload.row });
      break;
    case 'cell-info':
      const strData = payload.row.data[payload.header.key] as string;
      alert(`${payload.row.data.id} - ${payload.header.key} => ${String(strData)}`)
      break;
    case 'change-row-parent':
      activeSourceRow.value = payload.row;
      activeDestinationRowId.value = null;
      isDestinationRowIdDialogShown.value = true;
      break;
  }

  activeContextMenuMouseEvent.value = null;
}

function onSubmitDestinationRowIdDialog() {
  isDestinationRowIdDialogShown.value = false;
  if (
    !activeDestinationRowId.value
    || !activeSourceRow.value?.data?.id
  ) {
    return;
  }

  const sllParentIds = findAllParentRowsFor(activeDestinationRowId.value, data.value);

  if (sllParentIds?.includes(String(activeSourceRow.value.data.id))) {
    console.warn('[onSubmitDestinationRowIdDialog] Loop parent!!!')
    alert('Warninh! Loop parent!')
    return;
  }

  changeRowParent(activeSourceRow.value, activeDestinationRowId.value);
}
</script>

<template>
  <div class="new-table-app">
    <ColumnSettings
      v-bind="{
        columns,
        columnsSettings,
      }"
      @change:column-settings="onChangeColumnSettings"
    />
    <div>
      <div>
        <button @click="initData">
          Init Data
        </button>
      </div>

      <!-- 
        @change:cell-data="onChangeCellData"
      -->
      <NewTableWrapper
        ref="newTableWrapperRef"
        :key="timeStamp"
        :data="data"
        :columns="columns"
        :columns-settings="columnsSettings"
        :initial-filters="filters"
        :initial-sorts="sorts"
        :actions-change-modes="actionsChangeModes"
        :actions="actions"
        :isNumberColumnShown="true"
        :isCheckboxColumnShown="true"
        :isExpandColumnShown="true"
        :common-meta="{
          class: {
            stage: '--stage',
            subStage: '--sub-stage',
            task: '--task',
          }
        }"
        @row-action="onRowAction"
        @dblclick.self="(event) => newTableWrapperRef.switchOnModeForRow(ROW_MODES.EDIT, event.row)"
        @contextmenu.self="onContextMenu"
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

    <div>
      <ul>
        <li
          v-for="checkedRowId in checkedIds"
          :key="checkedRowId"
        >{{ checkedRowId }}</li>
      </ul>
    </div>

    <dialog
      v-if="isDestinationRowIdDialogShown"
      open
      style="z-index: 100;"
    >
      <p>Try to change parent for [{{ activeSourceRow.data.id }}]</p>
      <form
        method="dialog"
        @submit="onSubmitDestinationRowIdDialog"
      >
        <label>
          activeDestinationRowId:
          <input v-model="activeDestinationRowId">
        </label>
        <div class="dialog-buttons">
          <button
            type="button"
            @click="isDestinationRowIdDialogShown = false"
          >Cancel</button>
          <button type="submit">OK</button>
        </div>
      </form>
    </dialog>

    <Teleport
      v-if="activeContextMenuMouseEvent"
      to="body"
    >
      <NewContextMenu
        :menuItems="activeContextMenuItems"
        :menuMouseEvent="activeContextMenuMouseEvent"
        @select:item="onSelectContextMenuIte"
        @close="activeContextMenuMouseEvent = null"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.new-table-app {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

:deep() .--stage {
  background-color: #dfefff;
}

:deep() .--sub-stage {
  background-color: #f5faff;
}

:deep() .--task {
  background-color: #ffffff;
}

/* так можно переопределять стили */
:deep(.new-table .new-table__header__cell .new-table__header__cell__filter__icon.--active) {
  color: red;
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
