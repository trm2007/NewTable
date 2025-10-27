
import type { INewTableActions } from '../../NewTable/types/NewTableActionTypes';

import { NEW_TABLE_STANDART_ROW_MODES } from '../../NewTable/constants/rowModes';

export const NEW_TABLE_STANDART_ROW_ACTIONS: Record<string, string> = {
  EDIT: 'edit',
  CANCEL: 'cancel',
  SAVE: 'save',
  DELETE: 'delete',
  CHECK_ON: 'check-on',
  CHECK_OFF: 'check-off',
  EXPAND_ON: 'expand-on',
  EXPAND_OFF: 'expand-off',
  CELL_ACTION: 'cell-action', // -> NEW_TABLE_STANDART_CELL_ACTIONS
  CHANGE_CELL: 'change:cell'
};

export const NEW_TABLE_STANDART_CELL_ACTIONS: Record<string, string> = {
  CHANGE_CELL: 'change:cell'
};

// дкйствия, доступные для каждого типа строк
export const newTableStandartActions: INewTableActions = {
  default: {
    [NEW_TABLE_STANDART_ROW_ACTIONS.EDIT]: {
      actionName: NEW_TABLE_STANDART_ROW_ACTIONS.EDIT,
      icon: 'fa-solid fa-pen-to-square',
      modes: [NEW_TABLE_STANDART_ROW_MODES.VIEW],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
      actionName: NEW_TABLE_STANDART_ROW_ACTIONS.SAVE,
      icon: 'fa-solid fa-floppy-disk',
      modes: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL]: {
      actionName: NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL,
      icon: 'fa-solid fa-xmark',
      modes: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.DELETE]: {
      actionName: NEW_TABLE_STANDART_ROW_ACTIONS.DELETE,
      icon: 'fa-solid fa-trash',
    },
  },
};