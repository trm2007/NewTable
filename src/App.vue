<script setup lang="ts">

import { ref } from 'vue';

import type { INewTableRow } from './components/NewTable/types/NewTableRowTypes';
import type { INewTableColumn } from './components/NewTable/types/INewTableHeadTypes';
import type { INewTableHeaderSetting } from './components/NewTable/components/NewTableHeader/types/NewTableHeaderTypes';
import type { INewTableRowActionEvent, INewTableUpdateCellDataEvent } from './components/NewTable/types/NewTableEventTypes';
import type { IChangeColumnSettingsEvent } from './components/ColumnSettings/types';

import { generateLargeTestData } from './constants/testData';
import { columns as testColumns } from './constants/columns';
import { testColumnsSettings } from './constants/testColumnsSettings';
import { filters } from './constants/filters';

import { findParentRowsById, findRowById } from './helpers/finders';

import { NEW_TABLE_STANDART_ACTIONS } from './components/NewTableWrapper/constants/standartActions';

import NewTableWrapper from './components/NewTableWrapper/NewTableWrapper.vue';
import ColumnSettings from './components/ColumnSettings/ColumnSettings.vue';

const data = ref<INewTableRow[]>([]);
const columns = ref<INewTableColumn[]>([]);
const columnsSettings = ref<Record<string, INewTableHeaderSetting>>({});

const timeStamp = ref(Date.now());

function initData() {
  data.value = generateLargeTestData(); // testData;
  columns.value = testColumns;
  columnsSettings.value = testColumnsSettings;
  timeStamp.value = Date.now();
}

function onSave(row: INewTableRow) {
  setRow(row);
}

function onDelete(row: INewTableRow) {
  const parenRows = findParentRowsById(row.data.id, data.value);
  parenRows?.splice(
    parenRows.findIndex(r => r.data.id === row.data.id),
    1
  );
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

function onAction(event: INewTableRowActionEvent) {
  switch (event.name) {
    case NEW_TABLE_STANDART_ACTIONS.SAVE:
      onSave(event.row);
      break;
    case NEW_TABLE_STANDART_ACTIONS.DELETE:
      onDelete(event.row);
      break;
    default:
      console.log('Unknown action:', event.name, 'for row:', event.row);
  }
}

function onChangeColumnSettings(event: IChangeColumnSettingsEvent) {
  columnsSettings.value = {
    ...columnsSettings.value,
    [event.columnName]: event.columnsSettings,
  }
}

function onUpdateCellData(event: INewTableUpdateCellDataEvent) {
  const row = findRowById(event.row.data.id, data.value);
  if (row) {
    row.data[event.key] = event.value;
  }
}
</script>

<template>
  <div class="new-trable-app">
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

      <NewTableWrapper
        :key="timeStamp"
        :data="data"
        :columns="columns"
        :columns-settings="columnsSettings"
        :common-meta="{
          class: {
            stage: '--stage',
            subStage: '--sub-stage',
            task: '--task',
          }
        }"
        :initial-filters="filters"
        @row-action="onAction"
        @update:cell-data="onUpdateCellData"
      />
    </div>
  </div>
</template>

<style scoped>
.new-trable-app {
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
</style>
