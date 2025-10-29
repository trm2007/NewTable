<script setup lang="ts">
import { ref } from 'vue';

import type { INewTableRow } from '../../components/NewTable/components/NewTableRow/types/NewTableRowTypes';

import { useTestPage1NewReestrInitData } from './composables/TestPage1NewReestrInitData';
import { useTestPage1NewReestrChangeRowParentId } from './composables/TestPage1NewReestrChangeRowParentId';

import NewReestr from '../../components/NewReestr/NewReestr.vue';
import NewReestrChangeRowParentDialog from '../../components/NewReestr/components/NewReestrChangeRowParentDialog/NewReestrChangeRowParentDialog.vue';
import { findParentRowsById } from '../../helpers/finders';
import { useTestPage1NewReestrActions } from './composables/TestPage1NewReestrActions';
import { INewContexMenuItem } from '../../components/NewContextMenu/types';
import { INewTableCellNativeEvent } from '../../components/NewTable/types/NewTableEventTypes';
import { NEW_TABLE_STANDART_ROW_MODES } from '../../components/NewTable/constants/rowModes';

const newReestrRef = ref<typeof NewReestr>();

const {
  actions,
  actionsChangeModes,
  columns,
  columnsSettings,
  data,
  contextMenuItems,
  filters,
  sorts,
  initData,
} = useTestPage1NewReestrInitData();

const {
  activeDestinationRowId,
  isChangeRowParentDialogShown,
  activeSourceRow,
  onChangeRowParentId,
} = useTestPage1NewReestrChangeRowParentId(
  () => data.value
);

const {
  onDelete,
  onRowAction,
} = useTestPage1NewReestrActions(
  () => data.value,
  setRow,
  newReestrRef,
);

/**
 * МЕНЯЕТ ДАННЫЕ
 * @param row строка, которую нужно обновить в данных
 */
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

function onSelectContextMenuItem(menuItem: INewContexMenuItem) {
  const payload: INewTableCellNativeEvent = menuItem.payload as INewTableCellNativeEvent;

  switch (menuItem.actionName) {
    case 'edit-row':
      newReestrRef.value.switchOnModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, payload.row);
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
      isChangeRowParentDialogShown.value = true;
      break;
  }
}
</script>

<template>
  <div class="test-page1">
    <div class="test-page1__actions">
      <button @click="initData">
        Init Data
      </button>
    </div>

    <NewReestr
      ref="newReestrRef"
      :initial-data="data"
      :initial-columns="columns"
      :initial-columns-settings="columnsSettings"
      :initial-filters="filters"
      :initial-sorts="sorts"
      :initial-actions-change-modes="actionsChangeModes"
      :initial-actions="actions"
      :initial-context-menu-items="contextMenuItems"
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
      @select:item="onSelectContextMenuItem"
    />

    <NewReestrChangeRowParentDialog
      v-if="isChangeRowParentDialogShown"
      :activeSourceRow="activeSourceRow"
      @close="isChangeRowParentDialogShown = false"
      @change:destination-row-id="onChangeRowParentId"
    />
  </div>
</template>

<style scoped>
.test-page1 {
  width: 100%;
}

.test-page1__actions {
  border-radius: 8px;
  background-color: #eee;
  width: 100%;
  text-align: center;
  padding: 8px;
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
</style>