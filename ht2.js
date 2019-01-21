const table = [
    [
        { id: 0, row: 0, column: 0, position: 1 },
        { id: 1, row: 1, column: 0, position: 2 },
        { id: 2, row: 2, column: 0, position: 3 }
    ],
    [
        { id: 3, row: 0, column: 1, position: 4 },
        { id: 4, row: 1, column: 1, position: 5 },
        { id: 5, row: 2, column: 1, position: 6 }
    ],
    [
        { id: 6, row: 0, column: 2, position: 7 },
        { id: 7, row: 1, column: 2, position: 8 },
        { id: 8, row: 2, column: 2, position: 9 }
    ]
]

const printTable = (data, headerText) => {

    const headerEl = document.createElement('h3');
    headerEl.innerText = headerText;
    document.body.appendChild(headerEl);

    const rowsHTML = R.pipe(
        R.transpose,
        R.map((row) => ['<tr>', ...R.map((column) => `<td>id: ${column.id} </td>`, row), '</tr>'].join('')),
        R.join('')
    )(data);

    const table = document.createElement('table');
    table.innerHTML = `${rowsHTML}`;
    document.body.appendChild(table);
};

const rearrangeMatrix = (table, newColumn, newRow, item) => {

    const vector = R.flatten(table);

    const repositionItem = (vector, newColumn, newRow, item) => {
        const oldPosition = (item.column + 1) * (item.row + 1);
        const newPosition = (newColumn + 1) * (newRow + 1);
        const modifiedVector = [0, ...vector]
        const vectorWithoutItem = [...modifiedVector.slice(0, oldPosition), ...modifiedVector.slice(oldPosition + 1)];
        return [...vectorWithoutItem.slice(1, newPosition), item, ...vectorWithoutItem.slice(newPosition)];
    }

    const mapIndexed = R.addIndex(R.map);

    const updatePositions = mapIndexed((el, index) => Object.assign({}, el, {position: index + 1}));
    const splitIntoMatrix = (vector) => [vector.slice(0, 3), vector.slice(3, 6), vector.slice(6, 9)];
    const updateRows = R.map(mapIndexed((row, index) => Object.assign({}, row, {row: index} )));
    const updateColumns = mapIndexed((column, index) => R.map(row => Object.assign({}, row, {column: index}), column));
    
    return R.pipe(
        repositionItem,
        updatePositions,
        splitIntoMatrix,
        updateRows,
        updateColumns
    )(vector, newColumn, newRow, item);

};

printTable(table, 'Old Table');

const newColumn = 2;
const newRow = 2;
const item = table[0][0];

const newTable = rearrangeMatrix(table, newColumn, newRow, item);

printTable(newTable, 'New Table');