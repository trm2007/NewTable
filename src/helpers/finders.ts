import type { INewTableRow } from "../components/NewTable/types/NewTableRowTypes";

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

export function findParentRowWithChildIndexByChildRowId(
  childRowId: number | string,
  rows: INewTableRow[],
): { parent: INewTableRow, index: number } | undefined {
  for (const row of rows) {
    if (!row.children?.length) {
      continue;
    }

    const childIndex: number = row.children.findIndex(
      (r: INewTableRow): boolean => r.data.id === childRowId,
    );

    if (childIndex !== -1) {
      return {
        parent: row,
        index: childIndex
      };
    }

    const parentRowWithChildIndex = findParentRowWithChildIndexByChildRowId(childRowId, row.children);
    if (parentRowWithChildIndex) {
      return parentRowWithChildIndex;
    }
  }
}
