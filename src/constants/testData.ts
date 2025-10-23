import type { INewTableRowTemplate } from "../components/NewTable/types/NewTableRowTypes";

type TTestDataType = string | number | [] | object | null | undefined;

export interface ILocalNewTableRowData extends Record<string, TTestDataType> {
  id: string;
  name: string;
  status: string;
  pricePIR?: number;
  pricePNR?: number;
  priceSMR?: number;
  priceTotal?: number;
  customPricePIR?: number;
  customPricePNR?: number;
  customPriceSMR?: number;
  customPriceTotal?: number;
}

type ILocalNewTableRow = INewTableRowTemplate<ILocalNewTableRowData>

export const TEST_DATA_ROW_TYPES: Record<string, string> = {
  STAGE: 'stage',
  SUB_STAGE: 'subStage',
  TASK: 'task',
};

export const generateLargeTestData = (count: number = 10000): ILocalNewTableRow[] => {
  const result: ILocalNewTableRow[] = [];
  let currentId = 0;

  const MAX_LEVEL = 4;
  const availableStatuses = ['active', 'completed', 'in-progress', 'not-started'];

  const createNode = (level: number = 0): ILocalNewTableRow => {
    currentId++;
    const hasChildren = level === 0 || (level < MAX_LEVEL && Math.random() > 0.3);
    const rowType = level === 0
      ? TEST_DATA_ROW_TYPES.STAGE
      : hasChildren ? TEST_DATA_ROW_TYPES.SUB_STAGE : TEST_DATA_ROW_TYPES.TASK;

    const node: ILocalNewTableRow = {
      meta: { rowType },
      data: {
        id: `node-${currentId}`,
        name: `${rowType} ${currentId}`,
        status: availableStatuses[Math.floor(Math.random() * availableStatuses.length)],
      },
      actions: {
        edit: {
          eventName: 'edit',
          icon: 'fa-solid fa-pen-to-square',
          modes: ['view'],
        },
        save: {
          eventName: 'save',
          icon: 'fa-solid fa-floppy-disk',
          modes: ['edit'],
        },
        cancel: {
          eventName: 'cancel',
          icon: 'fa-solid fa-xmark',
          modes: ['edit'],
        },
        delete: {
          eventName: 'delete',
          icon: 'fa-solid fa-trash',
        },
      },
    };

    if (!hasChildren) {
      node.data.pricePIR = Math.round(Math.random() * 1000);
      node.data.pricePNR = Math.round(Math.random() * 1000);
      node.data.priceSMR = Math.round(Math.random() * 1000);
      node.data.priceTotal = node.data.pricePIR + node.data.pricePNR + node.data.priceSMR;
      node.data.customPricePIR = Math.round(Math.random() * 1000);
      node.data.customPricePNR = Math.round(Math.random() * 1000);
      node.data.customPriceSMR = Math.round(Math.random() * 1000);
      node.data.customPriceTotal = node.data.customPricePIR + node.data.customPricePNR + node.data.customPriceSMR;
    }

    if (hasChildren) {
      node.children = Array.from(
        { length: Math.floor(Math.random() * MAX_LEVEL) + 1 },
        () => createNode(level + 1)
      );
    }

    return node;
  };

  while (currentId < count) {
    result.push(createNode());
  }

  return result;
};

export const largeTestData = generateLargeTestData();