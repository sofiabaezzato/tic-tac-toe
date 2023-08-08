/* 
** The Gameboard rapresents the state of the board 
** each square holds a Cell
** and we add a dropSign method to be able to add Cells to squares
*/


function Gameboard() {
    const ROWS = 3
    const COLUMNS = 3
    const board = []

    // Create a 2D array that represent the state of the board
    // ROW = 0 is the top row
    // COLUMN = 0  is the left-most column
    for (let i = 0; i < ROWS; i++) {
        board[i] = []
        for (let j = 0; j < COLUMNS; j++) {
            board[i].push(0)
        }
    }

    const getBoard = () => board

    // dropSign checks if the selected square is unselected
    // THEN change that cell's value to the player sign
    // empty cell: 0
    // first player: 1
    // second player: 3
    const dropSign = (row, column, player, div) => {
        if (board[row][column] === 0) {
            board[row][column] = player.value;
            screen.renderSign(div, player.sign)
        } else {
            alert('this cell is already taken')
            return false;
        }
        console.log(board)
    }

    function checksum(row, column) {
        let i = parseInt(row)      
        let j = parseInt(column)
        let columnSum = 0
        let rowSum = 0
        let diagonalSum = 0
        let antidiagonalSum = 0
        if (i + j == 2) {
            for (let k = 0; k < ROWS; k++) {
                diagonalSum += board[k][ROWS - 1 - k];
            }
        } else if (i === j) {
            for (let k = 0; k < ROWS; k++) {
                antidiagonalSum += board[k][k]
            }
        } 
        for (let i = 0; i < COLUMNS; i++) {
            rowSum += board[row][i];
        }
        for (let i = 0; i < ROWS; i++) {
            columnSum += board[i][column];
        }
        return [rowSum, columnSum, diagonalSum, antidiagonalSum];
    }

    /* 
    ** Check if active player wins
    ** If total sum of respective rows, colum or diagonals is:
    ** 3: first player wins
    ** 9: second player wins
    */ 
    function isWinner(row, column, activePlayer) {
        let sum = checksum(row, column);
        for (let el of sum) {
            if (el === activePlayer.value * 3) {
                
                return true
            }
        }
        console.log(sum)
        return false;
    }

    function isGameOver() {
        const hasZero = board.some(row => row.includes(0));
        if (hasZero) return false
        return true
    }
    
    return { getBoard, dropSign, checksum, isWinner, isGameOver }
    
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard()

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

    const playRound = (row, column, div) => {

        dropSign = board.dropSign(row, column, activePlayer, div)
        if (dropSign === false) {
            switchTurn()
        }
        
        if (board.isWinner(row, column, activePlayer)) {
            activePlayer.points++
            console.log(activePlayer.points)
            return console.log(`${activePlayer.name} is winner`)
        } 

        if (board.isGameOver() && board.isWinner(row, column, activePlayer) === false) {
            console.log("it's a tie")
            resetRound()
        }

        switchTurn()
    }

    const resetRound = () => {
        const ROWS = 3;
        const COLUMNS = 3;

        // Reset the game board
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                board.getBoard[i][j] = 0 
            }
        }
    }
    return { playRound, getActivePlayer }
}


function ScreenController() {
    const game = GameController()

    const cellDiv = document.querySelectorAll(".cell")
    cellDiv.forEach((div) => {
    div.addEventListener(
        'click',
        function(div) {
        let row = div.target.dataset.row
        let column = div.target.dataset.column
        game.playRound(row, column, div)
        })
    })

    function renderSign(div, sign) {
        let id = div.target.id
        div = document.getElementById(id)
        console.log(div)
        if (sign === "X") {
            div.classList.add('x-sign')
        } else if (sign === "O") {
            div.classList.add('o-sign')
        }
    }

    

    return { renderSign }
}

const screen = ScreenController()