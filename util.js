function validPosition(board, place, newRow, newCol) {
    if (place) {
        if (board[newRow][newCol] != '') {
            // console.log('Invalid position, there is already a piece at it')
            return false
        }
    } else {
        if (board[newRow][newCol] === '') {
            // console.log('Invalid position, there is not a piece at it')
            return false
        }
        return true
    }

    // validates row
    for (let col = 0; col <= 7; col++) {
        if (board[newRow][col] === 'q') {
            // console.log('Invalid row')
            return false
        }
    }

    // validates col
    for (let row = 0; row <= 7; row++) {
        if (board[row][newCol] === 'q') {
            // console.log('Invalid col')
            return false
        }
    }

    // validates diagonal top left direction
    let row = newRow;
    let col = newCol;
    for (let i = 0; i <= 7; i++) {
        if (row < 0 || col < 0) {
            break
        }
        if (board[row][col] === 'q') {
            // console.log('Invalid diagonal top left direction')
            return false
        }
        row--
        col--
    }

    // validates diagonal top right direction
    row = newRow;
    col = newCol;
    for (let i = 0; i <= 7; i++) {
        if (row < 0 || col > 7) {
            break
        }
        if (board[row][col] === 'q') {
            // console.log('Invalid diagonal top right direction')
            return false
        }
        row--
        col++
    }

    // validates diagonal botton left direction
    row = newRow;
    col = newCol;
    for (let i = 0; i <= 7; i++) {
        if (row > 7 || col < 0) {
            break
        }
        if (board[row][col] === 'q') {
            // console.log('Invalid diagonal botton left direction')
            return false
        }
        row++
        col--
    }

    // validates diagonal botton right direction
    row = newRow;
    col = newCol;
    for (let i = 0; i <= 7; i++) {
        if (row > 7 || col > 7) {
            break
        }
        if (board[row][col] === 'q') {
            // console.log('Invalid diagonal botton right direction')
            return false
        }
        row++
        col++
    }

    return true
}

function buildBoard(prefix) {
    let div
    if (prefix == null || prefix == undefined || prefix == '') {
        div = document.getElementById('board');
    }else{
        div = document.createElement('div')
        let divSolutions = document.getElementById('solutionsPanel');
        divSolutions.appendChild(div)
        div.id = prefix
    }

    let table = document.createElement('table');
    table.style.margin = 10
    
    let white = true
    for (let row = 0; row <= 7; row++) {
        let tr = document.createElement('tr');

        for (let col = 0; col <= 7; col++) {
            let td = document.createElement('td');
            td.width = 60
            td.height = 60
            td.id = prefix + '' + row + '-' + col;
            td.onclick = tdClick;
            
            if (white) {
                td.className = 'white'
            } else {
                td.className = 'black'
            }
            white = !white

            tr.appendChild(td)
        }
        white = !white

        table.appendChild(tr)
    }

    div.appendChild(table)
};

function putPiece(board, prefix, place, row, col) {
    if (prefix == '') {
        if (!validPosition(board, place, row, col))
            return false
    }

    // console.log('teste');
    

    let td = document.getElementById(prefix + '' + row + '-' + col);
    if (place) {
        td.className = td.className + ' queen'
        board[row][col] =  'q'
    }else{
        td.className = td.className.replace(' queen', '')
        board[row][col] =  ''
    }
    return true
}

function placePiecesOnBoard(board, prefix) {
    for (let row = 0; row <= 7; row++) {
        for (let col = 0; col <= 7; col++) {
            if (board[row][col] == 'q') {
                // console.log(board)
                // console.log(prefix);
                // console.log(row);
                // console.log(col);
                
                putPiece(board, prefix, board[row][col] === 'q', row, col)
            }else{
                //alert('Invalid Position: ' + row + '-' + col)
            }
        };
    };
}

function tdClick(mouseEvent) {
    isQueen = mouseEvent.toElement.className.indexOf(' queen') >= 0
    ok = putPiece(board, '', !isQueen, mouseEvent.toElement.id.substring(0,1), mouseEvent.toElement.id.substring(2))
    if (!ok) {
        alert('Invalid Movement: Queen to ' + mouseEvent.toElement.id.substring(0,1) + '-' + mouseEvent.toElement.id.substring(2))
    }
}

function sleep(milliseconds) {
    return new Promise( (resolve) => {
        setTimeout(resolve, milliseconds)
    })
}

function refreshTests() {
    document.getElementById('tests').innerText = 'Tests made: ' + tests
}

function refreshSolutions() {
    document.getElementById('solutions').innerText = 'Solutions found: ' + solutions.length
}

async function findNextValidPosition(board, level, stopOnFirstSolution)  {
    if (level == 8) {
        return true
    } else {
        level++
    }

    let found = false;
    for (let row = 0; row <= 7; row++) {
        refreshTests()
        for (let col = 0; col <= 7; col++) {
            tests++
            //if (tests >= 1660090) await sleep(1000)
            if (validPosition(board, true, row, col)) {
                putPiece(board, '', true, row, col)                
                if (level <= 4) await sleep(1) // Comment this line or lower the level for faster result
                found = true
                //if (tests >= 1660090) await sleep(1000)

                if (level == 8) {
                    registerSolvedBoard(board)
                    //if (tests >= 1660090) await sleep(1000)

                    if (stopOnFirstSolution) {
                        return true
                    } else {
                        found = false
                        putPiece(board, '', false, row, col)
                    }
                } else {
                    let foundNext = await findNextValidPosition(board, level, stopOnFirstSolution)
                    if (!foundNext) {
                        found = false
                        putPiece(board, '', false, row, col)
                        //await sleep(2) 
                        //if (tests >= 1660090) await sleep(1000)
                    } else {
                        
                        found = false
                        foundNext = false
                        //putPiece(board, false, row, col)

                        return true
                    }
                }
            }
        }
    }
    refreshTests()
    return found
}

function registerSolvedBoard(board) {
    if (!alreadyAddedSolution(board)) {
        let newSolution = new Array()
        board.forEach(row => {
            newSolution.push(row.slice())
        });
        solutions.push(newSolution)
        let prefix = 's' + solutions.length + '_'
        buildBoard(prefix)
        placePiecesOnBoard(newSolution, prefix)
        refreshSolutions()
    }
}

function alreadyAddedSolution(board) {
    if (solutions.length <= 0) {
        return false
    }

    return solutions.some(solution => {
        let equal = true
        for (let row = 0; row < solution.length; row++) {
            for (let col = 0; col < solution[row].length; col++) {
                if (solution[row][col] != board[row][col]) {
                    equal = false
                    break
                }
            }
            if (!equal)
                break
        }
        if (equal) {
            return true
        }
    });
}

function addSolution() {
    registerSolvedBoard(board)

}

function test(){    
    alert(alreadyAddedSolution(board))
}