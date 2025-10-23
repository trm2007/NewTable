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

export const testData: ILocalNewTableRow[] = [
  {
    meta: {
      rowType: 'stage',
    },
    data: {
      id: 'stage-1',
      name: 'Stage 1',
      status: 'active',
    },
    children: [
      {
        meta: {
          rowType: 'subStage',
        },
        data: {
          id: 'subStage-1.1',
          name: 'subStage 1,1',
          status: 'completed',
          pricePIR: 11000,
          pricePNR: 11200,
          priceSMR: 11800,
          customPricePIR: 111200,
          customPricePNR: 112400,
          customPriceSMR: 113600,
          customPriceTotal: 114800,
        },
      },
      {
        meta: {
          rowType: 'subStage',
        },
        data: {
          id: 'subStage-1.2',
          name: 'subStage 1.2',
          status: 'in-progress',
          pricePIR: 12210,
          pricePNR: 12220,
          priceSMR: 12290,
          customPricePIR: 22120,
          customPricePNR: 22220,
          customPriceSMR: 22320,
          customPriceTotal: 22420,
        },
      },
    ],
  },
  {
    meta: {
      rowType: 'stage',
    },
    data: {
      id: 'stage-2',
      name: 'Stage 2',
      status: 'inactive',
    },
    children: [
      {
        meta: {
          rowType: 'subStage',
        },
        data: {
          id: 'subStage-2.1',
          name: 'subStage 2.1',
          status: 'not-started',
          pricePIR: 21510,
          pricePNR: 21620,
          priceSMR: 21790,
          customPricePIR: 25120,
          customPricePNR: 25220,
          customPriceSMR: 25320,
          customPriceTotal: 25420,
        },
      },
      {
        meta: {
          rowType: 'subStage',
        },
        data: {
          id: 'subStage-2.2',
          name: 'subStage 2.2',
          status: 'axive',
        },
        children: [
          {
            meta: {
              rowType: 'task',
            },
            data: {
              id: 'task-2.2.1',
              name: 'Task 2.2.1',
              status: 'axive',
              pricePIR: 23110,
              pricePNR: 23220,
              priceSMR: 23390,
              customPricePIR: 34120,
              customPricePNR: 34220,
              customPriceSMR: 34320,
              customPriceTotal: 34420,
            },
          },
          {
            meta: {
              rowType: 'task',
            },
            data: {
              id: 'task-2.2.2',
              name: 'Task 2.2.2',
              status: 'not-started',
              pricePIR: 24110,
              pricePNR: 24220,
              priceSMR: 24390,
              customPricePIR: 44120,
              customPricePNR: 44220,
              customPriceSMR: 44320,
              customPriceTotal: 44420,
            },
          },
        ],
      }
    ],
  },
];

export const generateLargeTestData = (count: number = 10000): ILocalNewTableRow[] => {
  const result: ILocalNewTableRow[] = [];
  let currentId = 0;

  const MAX_LEVEL = 4;
  const availableStatuses = ['active', 'completed', 'in-progress', 'not-started'];

  const createNode = (level: number = 0): ILocalNewTableRow => {
    currentId++;
    const hasChildren = level < MAX_LEVEL && Math.random() > 0.3;
    const rowType = level === 0
      ? 'stage'
      : hasChildren ? 'subStage' : 'task';

    const node: ILocalNewTableRow = {
      meta: { rowType },
      data: {
        id: `node-${currentId}`,
        name: `${rowType} ${currentId}`,
        status: availableStatuses[Math.floor(Math.random() * availableStatuses.length)]
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
      node.data.pricePIR = Math.round(Math.random() * 100000);
      node.data.pricePNR = Math.round(Math.random() * 100000);
      node.data.priceSMR = Math.round(Math.random() * 100000);
      node.data.priceTotal = node.data.pricePIR + node.data.pricePNR + node.data.priceSMR;
      node.data.customPricePIR = Math.round(Math.random() * 100000);
      node.data.customPricePNR = Math.round(Math.random() * 100000);
      node.data.customPriceSMR = Math.round(Math.random() * 100000);
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