/* 
** Factory functions:
** > createGameboard() -> board.
** > > getBoard()
** > > dropSign()
** > > printBoard()
**
** > createGameController() -> game.
** > > switchTurn()
** > > printNewRound()
** > > playRound()
**
** > createScreenController() -> screen.
** > > updateScreen()
** > > clickHandler()
*/

/* 
** The gameboard rapresents the state of the board 
** each square holds a Cell
** and we add a dropSign method to be able to add Cells to squares
*/



/* 
** A cell is a board square. Every cell can have 3 cellValue:
** 0: unselected square
** 1: playerOne's cell
** 3: playerTwo's cell
*/

function createCell() {
    let cellValue = 0

    const addCellValue =  (playerValue) => {
        cellValue = playerValue
    }

    const getCellValue = () => cellValue

    return {
        addCellValue,
        getCellValue
    }
}

function createGameboard() {
    const ROWS = 3
    const COLUMNS = 3
    const board = []

    for (let i = 0; i < ROWS; i++) {
        board[i] = []
        for (let j = 0; j < COLUMNS; j++) {
            board[i].push(createCell())
        }
    }

    // getBoard is an arrow function.
    // Its purpose is to provide external access to the board array 
    // from the outside od createGameboard() factory function
    const getBoard = () => board

    const dropSign = (row, column, player) => {

        const availableCells = board.filter((row) => row[column].getCellValue() === 0).map(row => row[column])
        if (!availableCells.length) return

        if (board[row][column].getCellValue() === 0) {
            board[row][column].addCellValue(player);
            return true
        }
        else {
            return false
        }
        /* if (board[row][column] === 0) {
            board[row][column].addCellValue(player);
            return true
        } else {
            return false;
        } */
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getCellValue()))
        console.log(boardWithCellValues)
    }

    return {
        getBoard,
        dropSign,
        printBoard,
    }
}

function createGameController(
    // I use these parameters to let the user customize the game
    // I can prompt the user for a name and call the function with:
    // const gameController = createGameController("Alice", "Computer")
    // If I simply call createGameController(), default names will be used
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = createGameboard()

    const players = [
        {
            name: playerOneName,
            sign: "X",
            value: 1,
            points: 0
        },
        {
            name: playerTwoName,
            sign: "O",
            value: 3,
            points: 0
        }
    ]

    let activePlayer = players[0]

    const switchTurn = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1]
        } else {
            activePlayer = players[0]
        }
    }
    const getActivePlayer = () => activePlayer

    const printNewRound = () => {
        board.printBoard()
    }

    const playRound = (row, column) => {
        board.dropSign(row, column, getActivePlayer().value)
        
        // check for winner and handle the win message
        /* let sum = [0, 0, 0, 0]
        if (row + column == 2) {
            for (let k = 0; k < 3; k++) {
                sum[2] += board[k][3 - 1 - k].getCellValue();
            }
        } else if (row === column) {
            for (let k = 0; k < 3; k++) {
                sum[3] += board[k][k].getCellValue()
            }
        } 
        for (let i = 0; i < 3; i++) {
            sum[0] += board[row][i].getCellValue();
        }
        for (let i = 0; i < 3; i++) {
            sum[1] += board[i][column].getCellValue();
        }
        for (let el of sum) {
            if (el === activePlayer.value * 3) {
                console.log("winner " + activePlayer.name)
            }
        } */

        switchTurn()
        printNewRound()
    }

    printNewRound()

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
}
    
function createScreenController() {
    const game = createGameController()
    const boardDiv = document.querySelector(".board")
    const turnDiv = document.querySelector(".turn")

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = ""

        // get the newest board version and player turn
        const board = game.getBoard()
        const activePlayer = game.getActivePlayer()

        // display player's turn
        turnDiv.innerHTML = `It's ${activePlayer.name} turn`

        // render board divs
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellBtn = document.createElement('button')
                cellBtn.classList.add("cell")
                cellBtn.dataset.row = i
                cellBtn.dataset.column = j

                if (cell.getCellValue() === 1) {
                    cellBtn.classList.add("x-sign")
                } else if (cell.getCellValue() === 3) {
                    cellBtn.classList.add("o-sign")
                }

                boardDiv.appendChild(cellBtn)
            })
        })

    }

    // add event listeners for the board
    function clickHandler(e) {
        const selectedRow = e.target.dataset.row
        const selectedColumn = e.target.dataset.column
        console.log(e)
        if (!selectedRow || !selectedColumn) return

        game.playRound(selectedRow, selectedColumn)
        updateScreen()
    }

    boardDiv.addEventListener('click', clickHandler)

    // initial render
    updateScreen()
}

createScreenController()
