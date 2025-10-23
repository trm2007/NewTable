import type { INewTableFilter } from "../components/NewTable/types/NewTableFilterTypes";
import type { INewTableRow } from "../components/NewTable/types/NewTableRowTypes";
import { compareFilterAsString } from "./compareFilterAsString";

/**
 * Генерирует отфлиотрованные данные,
 * с учетом того, что нужная строка может быть в дочерних элементах,
 * но в выборку попадет и её родитель, чтобы можно было его развернуть и увидеть дочернюю,
 * которая попадает под критерии фильтров
 * @param {INewTableFilter} currentFilter объект фильтра для колонки
 * @param {string} currentColumnName имя колонки
 * @param {INewTableRow[]} currentData все данные
 * @returns {INewTableRow[]} отфильтрованные данные с учетом вложений
 */
export function generateFilteredDataForNested(
    currentFilter: INewTableFilter,
    currentColumnName: string,
    currentData: INewTableRow[],
): INewTableRow[] {
    const resultData: INewTableRow[] = [];

    currentData.forEach(
        (currentRow: INewTableRow) => {
            const resultRow: INewTableRow = {
                ...currentRow,
                children: [],
            };

            if (currentRow.children?.length) {
                resultRow.children = generateFilteredDataForNested(
                    currentFilter,
                    currentColumnName,
                    currentRow.children
                );
            }

            if (
                !!resultRow.children?.length
                || currentFilter.currentValue === currentFilter.defaultValue
                || (('compare' in currentFilter && typeof currentFilter.compare === 'function')
                    ? currentFilter.compare(currentFilter.currentValue, currentColumnName, currentRow, currentData)
                        : compareFilterAsString(String(currentFilter.currentValue ?? ''), String(resultRow.data[currentColumnName] ?? ''))
                )
            ) {
                resultData.push(resultRow);
            }
        },
    );

    return resultData;
}