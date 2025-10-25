import { ROW_MODES } from "../components/NewTable/constants/rowModes";
import { NEW_TABLE_STANDART_ROW_ACTIONS } from "../components/NewTableWrapper/constants/standartActions";
import { TEST_DATA_ROW_TYPES } from "./testData";

export type TActionsChangeModesStandartIndexes = keyof typeof NEW_TABLE_STANDART_ROW_ACTIONS;

export interface IOnOffModes {
  on?: string[];
  off?: string[];
  withChildren?: boolean;
};

export type TTActionsChangeModesStandart = Record<TActionsChangeModesStandartIndexes, IOnOffModes>;

export const standartActionsChangeModes: TTActionsChangeModesStandart = {
  [TEST_DATA_ROW_TYPES.TASK]: {
    [NEW_TABLE_STANDART_ROW_ACTIONS.EDIT]: {
      on: [ROW_MODES.EDIT],
      off: [],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL]: {
      on: [],
      off: [ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
      on: [],
      off: [ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.DELETE]: {
      on: [],
      off: [ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_ON]: {
      on: [ROW_MODES.CHECKED],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_OFF]: {
      off: [ROW_MODES.CHECKED],
    },
  },

  default: {
    [NEW_TABLE_STANDART_ROW_ACTIONS.EDIT]: {
      on: [ROW_MODES.EDIT],
      off: [],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CANCEL]: {
      on: [],
      off: [ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
      on: [],
      off: [ROW_MODES.EDIT],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.DELETE]: {
      on: [],
      off: [ROW_MODES.EDIT],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_ON]: {
      on: [ROW_MODES.CHECKED],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_OFF]: {
      off: [ROW_MODES.CHECKED],
      withChildren: true,
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.EXPAND_ON]: {
      on: [ROW_MODES.EXPANDED],
    },
    [NEW_TABLE_STANDART_ROW_ACTIONS.EXPAND_OFF]: {
      off: [ROW_MODES.EXPANDED],
      withChildren: true,
    },
  }
};
