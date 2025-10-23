import type { INewTableColumn } from "../components/NewTable/types/INewTableHeadTypes";

const statusOptions = [
  { value: 'not-set', name: 'Not set' },
  { value: 'in-progress', name: 'In progress' },
  { value: 'completed', name: 'Completed' },
  { value: 'active', name: 'Active' },
];

export const columns: INewTableColumn[] = [
  {
    name: 'ID',
    key: 'id',
    meta: {
      width: 100,
    },
    components: {
      stage: {
        name: 'IdComponent',
        props: {},
      },
      subStage: {
        name: 'IdComponent',
        props: {},
      },
      task: {
        name: 'IdComponent',
        props: {},
      },
    },
  },
  {
    name: 'Name',
    key: 'name',
    meta: {
      width: 250,
    },
    components: {
      stage: {
        name: 'TextComponent',
        props: {},
      },
      subStage: {
        name: 'TextComponent',
        props: {},
      },
      task: {
        name: 'TextComponent',
        props: {},
      },
    },
  },
  {
    name: 'Status',
    key: 'status',
    meta: {
      width: 150,
    },
    components: {
      stage: {
        name: 'SimpleSelectComponent',
        props: {
          options: statusOptions,
        },
      },
      subStage: {
        name: 'SimpleSelectComponent',
        props: {
          options: statusOptions,
        },
      },
      task: {
        name: 'SimpleSelectComponent',
        props: {
          options: statusOptions,
        },
      },
    },
  },
  {
    name: 'Price PIR',
    key: 'pricePIR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: {},
      },
      subStage: {
        name: 'PriceComponent',
        props: {},
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  {
    name: 'Price PNR',
    key: 'pricePNR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: {},
      },
      subStage: {
        name: 'PriceComponent',
        props: {},
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  {
    name: 'Price SMR',
    key: 'priceSMR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: {},
      },
      subStage: {
        name: 'PriceComponent',
        props: {},
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  {
    name: 'Price Total',
    key: 'priceTotal',
    meta: {
      width: 130,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: {},
      },
      subStage: {
        name: 'PriceComponent',
        props: {},
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  {
    name: 'Custom Price PIR',
    key: 'customPricePIR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: {},
      },
      subStage: {
        name: 'PriceComponent',
        props: {},
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  {
    name: 'Custom Price PNR',
    key: 'customPricePNR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: {},
      },
      subStage: {
        name: 'PriceComponent',
        props: {},
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  {
    name: 'Custom Price SMR',
    key: 'customPriceSMR',
    meta: {
      width: 120,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: {},
      },
      subStage: {
        name: 'PriceComponent',
        props: {},
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
  {
    name: 'Custom Price Total',
    key: 'customPriceTotal',
    meta: {
      width: 130,
    },
    components: {
      stage: {
        name: 'PriceComponent',
        props: {},
      },
      subStage: {
        name: 'PriceComponent',
        props: {},
      },
      task: {
        name: 'PriceComponent',
        props: {},
      },
    },
  },
];
