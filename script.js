function chessToInt(coords) {
    let [x, y] = coords

    let tens = {
        "A": 0,
        "B": 10,
        "C": 20,
        "D": 30,
        "E": 40,
        "F": 50,
        "G": 60,
        "H": 70,
    }[x.toUpperCase()]
    ones = 8 - parseInt(y)

    return tens + ones
}

function intToChess(n) {
    t = Math.floor(n/10)
    o = n % 10
 
    let c = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F",
        6: "G",
        7: "H",
    }[t]

    n = (8 - o).toString()

    return c + n
}

function KnightsTravails(initialCoords, targetCoords) {
    initial = chessToInt(initialCoords)
    target = chessToInt(targetCoords)

    class Tree {
        constructor(root) {
            this.root = root
            this.children = []
        }

        get root() {
            return this.__root
        }

        set root(node) {
            this.__root = node
        }

        get children() {
            return this.__children
        }

        set children(nodes) {
            this.__children = nodes
        }

        withinBoard(n) {
            return !(n < 0 || n > 77 || n % 10 > 7)
        }
        
        traverse() {
            for (let i = 0; i < offsets.length; i++) {
                let newCoords = this.root + offsets[i]

                if (this.withinBoard(newCoords) && !visited.includes(newCoords)) {
                    let newRoot = new Tree(newCoords)
                    visited.push(newCoords)
                    this.children.push(newRoot)
                }
            }
        }
    }

    let offsets = [
        (2)*10 + (1), 
        (1)*10 + (2), 
        (-1)*10 + (2), 
        (-2)*10 + (1), 
        (-2)*10 + (-1), 
        (-1)*10 + (-2), 
        (1)*10 + (-2), 
        (2)*10 + (-1), 
    ]

    let visited = []
    let tree = new Tree(initial)
    visited.push(initial)

    function visitAll(t) {
        let queue = [t]
        
        while(visited.length != 64) {
            current = queue[0]
            current.traverse()
            for (let i = 0; i < current.children.length; i++) {
                queue.push(current.children[i])
            }
            queue.shift()
        }
        
    }
    
    function findHeight(t, counter, moves) {
        let newMoves = moves.concat([t.root])
        if (t.root == target) {
            knightMoves = counter
            moveset = newMoves
        }
        
        for (let i = 0; i < t.children.length; i++) {
            
            findHeight(t.children[i], counter + 1, newMoves)
            
        }
    }
    
    let knightMoves
    let moveset 
    visitAll(tree)
    findHeight(tree, 0, [])

    let desc = ''
    desc += `Path from ${initialCoords.toUpperCase()} to ${targetCoords.toUpperCase()}: <b>${knightMoves} moves</b><br>`

    desc += `${intToChess(moveset[0])}<br>`
    for (let i = 1; i < moveset.length; i++) {
        desc += `-> ${intToChess(moveset[i])} (${i})<br>`
    }

    return [desc, moveset]
}

console.log(KnightsTravails('c6', 'e8'))

function createBoard() {
    let board = document.querySelector("#board");
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let cell = document.createElement("div")
            // CELL is even-odd pattern, numbered, centered via grid
            let id = 10*i + 1*j

            if ((i + j) % 2 == 1) {
                cell.style['background-color'] = 'rgb(240, 240, 240)';
               
            } else {
                cell.style['background-color'] = 'rgb(170, 170, 170)';
            }
            
            cell.style['color'] = 'rgb(50, 50, 50)';
            cell.style['display'] = 'grid'
            cell.style['align-items'] = 'center';
            cell.style['justify-content'] = 'center';
            cell.style['font-weight'] = 'italic';

            cell.style['font-size'] = '1.6vh';
            cell.style['grid-area'] = `${j+1} / ${i+1} / ${j+2} / ${i+2}`

            cell.setAttribute("class", "cell")
            cell.setAttribute("id", `${id}`)
            cell.textContent = intToChess(id)

            cell.addEventListener('click', selectCell)
            board.appendChild(cell)

            
        }
    }
}

let firstSelected = false
let secondSelected = false
let firstSquare = null
let secondSquare = null

function reset() {
    firstSelected = false
    secondSelected = false
    firstSquare = null
    secondSquare = null
    board.textContent = ''
    desc = document.getElementById('desc')
    desc.innerHTML = ''

    initialsquare = document.getElementById('initialsquare')
    initialsquare.textContent = 'Initial square: '
    targetsquare = document.getElementById('targetsquare')
    targetsquare.textContent = 'Target square: '
    createBoard()
}

function selectCell(e) {
    let id = e.target.id
    let cell = document.getElementById(id)

    if (!firstSelected) {
        cell.style['background-color'] = 'rgb(98, 227, 128)'
        cell.style['color'] = 'white'

        initialSquare = document.getElementById("initialsquare")
        initialSquare.textContent = `Initial square: ${e.target.textContent}`

        firstSelected = true
        firstSquare = e.target.id
    }

    else if (firstSelected && !secondSelected) {
        cell.style['background-color'] = 'rgb(98, 227, 227)'
        cell.style['color'] = 'white'
        let targetSquare = document.getElementById("targetsquare")
        targetSquare.textContent = `Target square: ${e.target.textContent}`

        secondSquare = e.target.id
        secondSelected = true
    }

    else if (firstSelected && secondSelected) {
        let previousCell = document.getElementById(secondSquare)
        let i = Math.floor(secondSquare / 10)
        let j = secondSquare % 10

        if ((i + j) % 2 == 1) {
            previousCell.style['background-color'] = 'rgb(240, 240, 240)';
           
        } else {
            previousCell.style['background-color'] = 'rgb(170, 170, 170)';
        }
        previousCell.style['color'] = 'rgb(50, 50, 50)';

        cell.style['background-color'] = 'rgb(98, 227, 227)'
        cell.style['color'] = 'white'
        targetSquare = document.getElementById("targetsquare")
        targetSquare.textContent = `Target square: ${e.target.textContent}`
        
        secondSquare = id
    }

    if (secondSelected) {
        desc = document.getElementById("desc")
        desc.innerHTML = KnightsTravails(intToChess(firstSquare), intToChess(secondSquare))[0]
    }
    // blue: rgb(98, 227, 227)
}

button = document.getElementById("reset")
button.addEventListener("click", reset)

reset()











