function KnightsTravails(initialCoords, targetCoords) {
    function chessToInt(coords) {
        let [x, y] = coords
    
        let tens
        switch(x.toUpperCase()) {
            case "A":
                tens = 0
                break
            case "B":
                tens = 10
                break
            case "C":
                tens = 20
                break
            case "D":
                tens = 30
                break
            case "E":
                tens = 40
                break
            case "F":
                tens = 50
                break
            case "G":
                tens = 60
                break
            case "H":
                tens = 70
                break
        }
        ones = 8 - parseInt(y)
    
        return tens + ones
    }

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

    
    function intToChess(n) {
        t = Math.floor(n/10)
        o = n % 10
     
        let c
        switch(t) {
            case 0:
                c = "A"
                break
            case 1:
                c = "B"
                break
            case 2:
                c = "C"
                break
            case 3:
                c = "D"
                break
            case 4:
                c = "E"
                break
            case 5:
                c = "F"
                break
            case 6:
                c = "G"
                break
            case 7:
                c = "H"
                break
        }
        n = (8 - o).toString()
    
        return c + n
    }
    
    desc = ''
    desc += `The shortest number of knight moves from ${initialCoords.toUpperCase()} to ${targetCoords.toUpperCase()} is ${knightMoves}.\n`
    desc += 'One possible path is as follows:\n'

    desc += `${intToChess(moveset[0])}\n`
    for (let i = 1; i < moveset.length; i++) {
        desc += `-> ${intToChess(moveset[i])} (${i})\n`
    }

    return desc
}

console.log(KnightsTravails('c6', 'e8'))





