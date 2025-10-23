import type { INewTableRow } from "../components/NewTable/types/NewTableRowTypes";
import type { TFindParentRowWithChildIndexByChildRowId } from "./finders";

import { findParentRowWithChildIndexByChildRowId } from "./finders";

export function calcChildSums(row: INewTableRow, data: INewTableRow[], columnsToCalc: string[]) {
  columnsToCalc.forEach(
    (columnName: string) => {
      row.data[columnName] = row.children.reduce(
        (acc: number, childRow: INewTableRow): number => acc = acc + Number(childRow.data[columnName] || 0),
        0,
      );
    }
  )
}

/**
 * Calculate the sums of the children for a given parent row
 * @param {INewTableRow} row - The parent row for which to calculate the sums
 * @param {INewTableRow[]} data - The array of rows to search for the parent
 * @param {string[]} columnsToCalc - The columns for which to calculate the sums
 */
export function calcParentSums(
  row: INewTableRow,
  data: INewTableRow[],
  columnsToCalc: string[]
): void {
  let currentParent: TFindParentRowWithChildIndexByChildRowId | null = null;

  let newParentRowWithIndexOfParent: TFindParentRowWithChildIndexByChildRowId
    = findParentRowWithChildIndexByChildRowId(row.data.id, data);

  while (currentParent !== newParentRowWithIndexOfParent && !!newParentRowWithIndexOfParent) {
    calcChildSums(newParentRowWithIndexOfParent.parent, data, columnsToCalc);
    currentParent = newParentRowWithIndexOfParent;
    newParentRowWithIndexOfParent = findParentRowWithChildIndexByChildRowId(currentParent.parent.data.id, data);
  }
}

export function recursiveCalcSumsForAllData(
  data: INewTableRow[],
  columnsToCalc: string[],
  allData?: INewTableRow[]
) {
  allData = allData || data
  data.forEach(
    (currentRow: INewTableRow) => {
      if (!currentRow.children?.length) {
        if (!allData) {
          return
        }
        calcParentSums(currentRow, allData, columnsToCalc);
      } else {
        recursiveCalcSumsForAllData(currentRow.children, columnsToCalc, allData);
      }
    }
  );
}