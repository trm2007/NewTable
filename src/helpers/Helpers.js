import { findIndexForObjectId, standartFunctionForCompareObject } from "libs/ObjectsArraysLib";

/**
 * 
 * @param {Array} TreeDataArray массив, созданный из классического дерева с помощью функции convertTreeToArraySimple
 * @param {Object} DataItem объект, для которого будет происходить поиск
 * @param {Object} IdFields индексные поля, по которым происходит сравнение при поиске
 * @param {Object} INDEXES объект с индексами в каждом элементе массива TreeDataArray,
 * важными индексами являются INDEXES.DataIndex и INDEXES.LevelIndex
 * 
 * @returns {Number} индекс объекта DataItem в плоском массиве TreeDataArray,
 * если объект в массиве не найден, то вернет -1
 */
function getCurrentIndex(TreeDataArray, DataItem, IdFields, INDEXES) {
    if (!TreeDataArray || !TreeDataArray.length) {
        return -1;
    }

    if (!DataItem) {
        return -1;
    }

    const ObjectId = INDEXES.DataIndex ? DataItem[INDEXES.DataIndex] : DataItem;

    return findIndexForObjectId(TreeDataArray, ObjectId, IdFields, (Item) => {
        return standartFunctionForCompareObject(
            (INDEXES.DataIndex ? Item[INDEXES.DataIndex] : Item),
            ObjectId,
            IdFields
        )
    });
}

/**
 * Возвращает массив всех родительских элементов для указанного ObjectId,
 * в 0-м элементе, если есть, будет самый верхний родитель (корневой),
 * иначе вернется undefined
 * 
 * @param {Array} TreeDataArray массив, созданный из классического дерева с помощью функции convertTreeToArraySimple
 * @param {Object} DataItem объект, для которого будет происходить поиск
 * @param {Object} IdFields индексные поля, по которым происходит сравнение при поиске
 * @param {Object} INDEXES объект с индексами в каждом элементе массива TreeDataArray,
 * важными индексами являются INDEXES.DataIndex и INDEXES.LevelIndex
 * @param {Boolean} OnlyNearestFlag флаг, указывающий, что нужно найти только ближайшего родителя
 * 
 * @returns {Array} массив родителей, при этом ближайший родитель будет последним в массиве,
 * а на первом месте будет корневой элемент, если родителя найти не удалось, то вернется пустой массив []
 */
export function getAllParentsForDataItem(
    TreeDataArray,
    DataItem,
    IdFields,
    INDEXES,
    OnlyNearestFlag = false
) {
    const CurrentIndex = getCurrentIndex(TreeDataArray, DataItem, IdFields, INDEXES);

    if (CurrentIndex == -1) {
        return [];
    }

    // исходный уровень элемента
    let StartParentLevel = DataItem[INDEXES.LevelIndex];

    const ParentsArray = [];

    for (let i = CurrentIndex; i >= 0; i--) {
        // если уровень текущего элемента меньше, чем уровень исходного,
        // то по существующей логике формирования массива TreeDataArray - это ближайший элемент 
        // и тогда он является родителем исходного
        if (TreeDataArray[i][INDEXES.LevelIndex] < StartParentLevel) {
            // добавляем родителя в массив на первую позицию
            ParentsArray.unshift(TreeDataArray[i]);

            // если установлен флаг, что нужен только ближайший родитель, то прерываем цикл
            if (OnlyNearestFlag) {
                break;
            }
            // меняем исходный уровень родителя на найденный
            StartParentLevel = TreeDataArray[i][INDEXES.LevelIndex];
        }

    }

    return ParentsArray;
}

/**
 * 
 * @param {Array} TreeDataArray массив, созданный из классического дерева с помощью функции convertTreeToArraySimple
 * @param {Object} DataItem объект, для которого будет происходить поиск
 * @param {Object} IdFields индексные поля, по которым происходит сравнение при поиске
 * @param {Object} INDEXES объект с индексами в каждом элементе массива TreeDataArray,
 * важными индексами являются INDEXES.DataIndex и INDEXES.LevelIndex
 * 
 * @returns {Object} Вернет ближайшего родителя для элемента DataItem, если родитель не найден, то вернется undefind
 */
export function getNearestParent(TreeDataArray, DataItem, IdFields, INDEXES) {
    return getAllParentsForDataItem(TreeDataArray, DataItem, IdFields, INDEXES, true)[0];
}