import type { INewTableRow } from "../constants/testData";

export function findRowById(
  rowId: number | string,
  rows: INewTableRow[],
): INewTableRow | undefined {
  const findedRow = rows.find(r => r.data.id === rowId);
  if (!findedRow) {
    for (const row of rows) {
      if (row.children?.length) {
        const childRow = findRowById(rowId, row.children);
        if (childRow) {
          return childRow;
        }
      }
    }
  } else {
    return findedRow;
  }
}

export function findParentRowsById(
  rowId: number | string,
  rows: INewTableRow[],
): INewTableRow[] | undefined {
  const findedRow = rows.find(r => r.data.id === rowId);
  if (!findedRow) {
    for (const row of rows) {
      if (row.children?.length) {
        const childRows = findParentRowsById(rowId, row.children);
        if (childRows) {
          return childRows;
        }
      }
    }
  } else {
    return rows;
  }
}

export function findParentRowById(
  rowId: number | string,
  rows: INewTableRow[],
): { parent: INewTableRow, index: number } | undefined {
  for (const row of rows) {
    const childIndex = row.children?.findIndex(r => r.data.id === rowId);
    if (childIndex && childIndex !== -1) {
      return {
        parent: row,
        index: childIndex
      };
    }
    if (row.children?.length) {
      const parentRowWithChildIndex = findParentRowById(rowId, row.children);
      if (parentRowWithChildIndex) {
        return parentRowWithChildIndex;
      }
    }
  }
}
