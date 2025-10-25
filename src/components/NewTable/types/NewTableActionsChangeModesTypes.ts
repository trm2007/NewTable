export interface INewTableOnOffModes {
  on?: string[];
  off?: string[];
  withChildren?: boolean;
};

export type TNewTableActionsChangeModesStandart = Record<'default' | string, INewTableOnOffModes>;
