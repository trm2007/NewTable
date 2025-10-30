<script setup lang="ts">
import { ref } from 'vue';

import type { INewTableRow } from '../../components/NewTable/components/NewTableRow/types/NewTableRowTypes';
import type { INewContexMenuItem } from '../../components/NewContextMenu/types';
import type { INewTableCellNativeEvent } from '../../components/NewTable/types/NewTableEventTypes';

import { useTestPage1NewReestrInitData } from './composables/TestPage1NewReestrInitData';
import { useTestPage1NewReestrChangeRowParentId } from './composables/TestPage1NewReestrChangeRowParentId';

import { findParentRowsById } from '../../helpers/finders';
import { useTestPage1NewReestrActions } from './composables/TestPage1NewReestrActions';
import { NEW_TABLE_STANDART_ROW_MODES } from '../../components/NewTable/constants/rowModes';

import NewReestr from '../../components/NewReestr/NewReestr.vue';
import NewReestrChangeRowParentDialog from '../../components/NewReestr/components/NewReestrChangeRowParentDialog/NewReestrChangeRowParentDialog.vue';
import NewSplitter from '../../components/NewSplitter/NewSplitter.vue';

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
    <NewSplitter>
      <template #div1>
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
        >
          <!-- <template v-slot:head[id]sort="idSlotProps">
        <span
          v-if="idSlotProps.sorts[idSlotProps.cellName]"
          style="color: green;"
        >{{ idSlotProps.cellName }} - sorted</span>
        <span
          v-else
          style="color: gray;"
        >{{ idSlotProps.cellName }} - unsorted</span>
      </template> -->

          <template v-slot:cell[id]="idSlotProps">
            <span style="color: red;">id[{{ idSlotProps.value }}]</span>
          </template>
          <template v-slot:cell[name]="nameSlotProps">
            <span style="color: blue;">{{ nameSlotProps.value }}</span>
          </template>
        </NewReestr>
      </template>
      <template #div2>
        <div>
          SADFGSADRGSADREGAERGASGASDFA
          SADFGSADRGSADREGAERGASGASDFA
          SADFGSADRGSADREGAERGASGASDFA
          SADFGSADRGSADREGAERGASGASDFA
          SADFGSADRGSADREGAERGASGASDFA
          SADFGSADRGSADREGAERGASGASDFA
          SADFGSADRGSADREGAERGASGASDFA
        </div>
      </template>
    </NewSplitter>

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
  display: flex;
  flex-direction: column;
  gap: 16px;
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

dialog {
  top: 50%;
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

:deep(dialog p) {
  padding: 0;
  margin: 0;
}

:deep(dialog form) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(dialog form .dialog-buttons) {
  display: flex;
  gap: 8px;
}
</style>