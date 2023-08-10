/* 
** Main Factory functions:
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
** > createScreenController()
** > > updateScreen()
** > > clickHandler()
*/


/* 
** A cell is a board square. Every cell can have 3 cellValue:
** 0: unselected square
** 1: playerOne's cell
** 3: playerTwo's cell
*/

function createCell() {
    let cellValue = 0

    const addCellValue = (playerValue) => {
        cellValue = playerValue
    }

    const getCellValue = () => cellValue

    return {
        addCellValue,
        getCellValue
    }
}

/* 
** The gameboard rapresents the state of the board 
** each square holds a Cell
** and we add a dropSign method to be able to add Cells to squares
*/
function createGameboard() {
    const ROWS = 3
    const COLUMNS = 3
    let board = []

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
        if (!availableCells.length) {
            return
        }

        if (board[row][column].getCellValue() === 0) {
            board[row][column].addCellValue(player);
            return true
        }
        else {
            return false
        }
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

    let won = false
    const isWinner = () => won

    const playRound = (row, column) => {
        const setSign = board.dropSign(row, column, getActivePlayer().value)
        
        // check for winner and handle the win
        const isWinner = function(){      
            let sumArr = calculateSums(row, column, board.getBoard())
            
            if (sumArr.includes(activePlayer.value * 3)) {
                getActivePlayer().points++
                return true
            } else {
                return false
            }
        }

        won = isWinner()

        if (setSign && !won) {
            switchTurn()
        }

        printNewRound()
    }

    function calculateSums(row, column, board) {
        // Index 0: selected row sum
        // Index 1: selected column sum
        // Index 2: diagonal from top-left to bottom-right
        // Index 3: diagonal from top-right to bottom-left
        const sum = [0, 0, 0, 0]; 
        
        for (let i = 0; i < 3; i++) {
            // Calculate row sums
            sum[0] += board[row][i].getCellValue();
    
            // Calculate column sums
            sum[1] += board[i][column].getCellValue();
            
            // Calculate diagonal from top-left to bottom-right
            if (row === column) {
                sum[2] += board[i][i].getCellValue();
            }
            
            // Calculate diagonal from top-right to bottom-left
            if (parseInt(row) + parseInt(column) == 2) {
                sum[3] += board[i][2 - i].getCellValue();
            }   
        }
        return sum;
    }

    function boardIsFull(board) {
        for (let row of board) {
            for (let cell of row) {
                if (cell.getCellValue() === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function resetBoard() {
        const boardArray = board.getBoard();
        for (let i = 0; i < boardArray.length; i++) {
            for (let j = 0; j < boardArray[i].length; j++) {
                boardArray[i][j].addCellValue(0);
            }
        }
    }

    printNewRound()

    return {
        players,
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        boardIsFull,
        isWinner,
        resetBoard
    }
}
    
function createScreenController() {
    const game = createGameController()
    const titleDiv = document.querySelector(".title")
    const boardDiv = document.querySelector(".board")
    const turnDiv = document.querySelector(".turn")
    const playerOnePointsDiv = document.querySelector(".pointsOne")
    const playerTwoPointsDiv = document.querySelector(".pointsTwo")
    const btn = document.getElementById("playAgainBtn")
    const resetBtn = document.getElementById("resetBtn")

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = ""

        // get the newest board version and player turn
        const board = game.getBoard()
        const activePlayer = game.getActivePlayer()

        // display player's turn
        turnDiv.innerHTML = `It's ${activePlayer.name} turn`

        // update points
        playerOnePointsDiv.innerHTML = `${game.players[0].points}`
        playerTwoPointsDiv.innerHTML = `${game.players[1].points}`


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

        // Check if the game ended in a draw and display message
        if (game.boardIsFull(game.getBoard()) === true && game.isWinner() === false) {
            disableBtns()
            handleDraw()
        }
        else if (game.isWinner() === true) {
            disableBtns()
            handleWin()
        }
    }

    if (game.boardIsFull(game.getBoard()) === false && game.isWinner() === false) {
        titleDiv.textContent = "TIC TAC TOE"
        btn.innerText = "START GAME"
        openModal()
    }

    function handleWin() {
        titleDiv.innerHTML = `${game.getActivePlayer().name} wins!`;
        btn.innerText = "PLAY AGAIN"
        openOverlay()
        setTimeout(openModal, 2000)
        
    }

    function handleDraw() {
        titleDiv.textContent = "It's a draw!";
        btn.innerText = "PLAY AGAIN"
        openOverlay()
        setTimeout(openModal, 2000)
    }

    function disableBtns() {
        document.querySelectorAll(".cell").forEach(cell => {
            cell.disabled = true
        })
    }

    function openModal() {
        let modal = document.getElementById('modal')
        modal.style.display = "flex"
        return true
    }

    function closeModal() {
        let modal = document.getElementById('modal')
        game.resetBoard()
        updateScreen()
        closeOverlay()
        modal.style.display = "none"
    }

    function openOverlay() {
        let overlay = document.querySelector(".overlay")
        overlay.style.display = "flex"
    }

    function closeOverlay() {
        let overlay = document.querySelector(".overlay")
        overlay.style.display = "none"
    }

    function resetGame() {
        game.resetBoard()
        game.players.forEach(player => player.points = 0)
        console.log(game.players)
        updateScreen()
    }
    
    // event listeners
    boardDiv.addEventListener('click', clickHandler)
    btn.onclick = () => closeModal()
    resetBtn.onclick = () => resetGame()

    // initial render
    updateScreen()
}

createScreenController()
