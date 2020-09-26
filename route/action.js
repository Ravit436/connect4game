
const constants = require("./constants");
const responseMessage = require("./responseMessage");

module.exports = {
    performAction,
};

function performAction(req, res) {
    const action = req.body.action;
    const column = req.body.column;
    if(action == 'START') {
        resetGameValues();
        return res.send(responseMessage.READY_ACTION);
    }

    if(!('column' in req.body) || !global.actionStarted || global.gameOver) {
        return res.send(responseMessage.INVALID_MOVE);
    }

    const isFilled = checkIfColumnIsFilled(column);
    if(isFilled) {
        return res.send(responseMessage.INVALID_MOVE);
    }

    let coinValue = constants.coin.RED;
    global.noOfMoves++;
    if(global.noOfMoves % 2) {
        coinValue = constants.coin.YELLOW;
    }

    assignValueInIndex(column, coinValue);

    // * min of moves after which there can be wins
    if(global.noOfMoves >= constants.noOfConects * 2 - 1) {
        const isWinner = checkIfThereIsWinner(column, coinValue);
        if(isWinner) { 
            global.gameOver = 1;
            const responseMsg = responseMessage.YELLOW_WINS;
            if(coinValue == constants.coin.RED) {
                responseMsg = responseMessage.RED_WINS;
            }
            console.log(global.connect4Matrix, global.currentColumnRow, global.noOfMoves, global.actionStarted, global.gameOver);
            return res.send(responseMsg);
        }
    }

    console.log(global.connect4Matrix, global.currentColumnRow, global.noOfMoves, global.actionStarted, global.gameOver);
    return res.send(responseMessage.VALID_MOVE);
}

function resetGameValues() {
    global.connect4Matrix = new Array(constants.rows);
    global.currentColumnRow = Array(constants.rows);
    for(let i = 0; i < constants.rows; i++) {
        global.connect4Matrix[i] = new Array(constants.columns);
        global.currentColumnRow[i] = -1; // * not traversed
        for(let j = 0; j < constants.columns; j++) {
            global.connect4Matrix[i][j] = 0;
        }
    }

    global.noOfMoves = 0;
    global.actionStarted = 1;
    global.gameOver = 0;
}

function checkIfColumnIsFilled(column) {
    const row = global.currentColumnRow[column];
    if(row == constants.rows - 1) {
        return true;
    }
}

function assignValueInIndex(column, coinValue) {
    let row = global.currentColumnRow[column];
    global.currentColumnRow[column] = row = row + 1;
    global.connect4Matrix[row][column] = coinValue;
}

function checkIfThereIsWinner(column, coinValue) {
    let isWinner = checkIfColumnWinner(column, coinValue);
    if(!isWinner) {
        isWinner = checkIfRowWinner(column, coinValue);
        if(!isWinner) {
            isWinner = checkIfDiagonalWinner(column, coinValue);
        }
    }
    return isWinner;
}

function checkIfColumnWinner(column, coinValue) {
    const row = global.currentColumnRow[column];
    let rowCount = 1; // * including current

    // * check below roes of that column
    let belowRow = row - 1;
    while(belowRow >= 0 && global.connect4Matrix[belowRow][column] == coinValue) {
        rowCount++;
        belowRow--;
    }

    if(rowCount == constants.noOfConects) {
        return true;
    }
}

function checkIfRowWinner(column, coinValue) {
    const row = global.currentColumnRow[column];
    let columnCount = 1; // * including current

    // * check below rows of that column
    let leftColumn = column - 1;
    while(leftColumn >= 0 && global.connect4Matrix[row][leftColumn] == coinValue) {
        columnCount++;
        leftColumn--;
    }

    // * check above rows of that column
    let rightColumn = column + 1;
    while(rightColumn < constants.columns && global.connect4Matrix[row][rightColumn] == coinValue) {
        columnCount++;
        rightColumn++;
    }

    if(columnCount == constants.noOfConects) {
        return true;
    }
}

function checkIfDiagonalWinner(column, coinValue) {
    const row = global.currentColumnRow[column];
    let columnCount = 1; // * including current

    // * check for left diagonal below
    let leftColumn = column - 1;
    let leftRow = row - 1;
    while(leftColumn >= 0 && leftRow >= 0 && global.connect4Matrix[leftRow][leftColumn] == coinValue) {
        columnCount++;
        leftRow--;
        leftColumn--;
    }

    // * check for left diagonal above
    let rightColumn = column + 1;
    let rightRow = row + 1;
    while(rightColumn < constants.columns && rightRow < constants.rows && global.connect4Matrix[rightRow][rightColumn] == coinValue) {
        columnCount++;
        rightColumn++;
        rightRow++;
    }

    if(columnCount == constants.noOfConects) {
        return true;
    }

    columnCount = 1;
    
    // * check for right diagonal above
    let leftColumn = column + 1;
    let leftRow = row - 1;
    while(leftColumn < constants.columns && leftRow >= 0 && global.connect4Matrix[leftRow][leftColumn] == coinValue) {
        columnCount++;
        leftRow--;
        leftColumn++;
    }

    // * check for right diagonal below
    let rightColumn = column - 1;
    let rightRow = row + 1;
    while(rightColumn >= 0 && rightRow < constants.rows && global.connect4Matrix[rightRow][rightColumn] == coinValue) {
        columnCount++;
        rightColumn--;
        rightRow++;
    }

    if(columnCount == constants.noOfConects) {
        return true;
    }
}
