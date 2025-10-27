import type { TNewTableActionsChangeModesStandart } from "../../NewTable/types/NewTableActionsChangeModesTypes";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../NewTable/constants/rowModes";
import { NEW_TABLE_STANDART_ROW_ACTIONS } from "./standartActions";
import { TEST_DATA_ROW_TYPES } from "../../../constants/testData";
import { NEW_TABLE_DEFAULT_TYPE } from "../../NewTable/constants/defaultRowType";

/**
 * @constant {TTActionsChangeModesStandart} standartActionsChangeModes для каждого типа строк заданы акции,
 * которые включают или отключают несколько режимов
 */
export const newTableStandartActionsChangeModes: TNewTableActionsChangeModesStandart = {
  [TEST_DATA_ROW_TYPES.TASK]: {
    [NEW_TABLE_STANDART_ROW_ACTIONS.EDIT]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
      off: [],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.DELETE]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_ON]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.CHECKED],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_OFF]: {
      off: [NEW_TABLE_STANDART_ROW_MODES.CHECKED],
    },
  },

  [NEW_TABLE_DEFAULT_TYPE]: {
    [NEW_TABLE_STANDART_ROW_ACTIONS.EDIT]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
      off: [],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.DELETE]: {
      on: [],
      off: [NEW_TABLE_STANDART_ROW_MODES.EDIT],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_ON]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.CHECKED],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_OFF]: {
      off: [NEW_TABLE_STANDART_ROW_MODES.CHECKED],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.EXPAND_ON]: {
      on: [NEW_TABLE_STANDART_ROW_MODES.EXPANDED],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.EXPAND_OFF]: {
      off: [NEW_TABLE_STANDART_ROW_MODES.EXPANDED],
      withChildren: true,
    },
  }
};
