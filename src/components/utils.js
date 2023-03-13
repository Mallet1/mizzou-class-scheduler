export const getGrid = (width, height, numOfCells) => {
  let rows = []
  let columns = []

  for (let i = 0; i <= numOfCells; i++) {
    rows.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: '0px',
          top: (height / numOfCells) * i + 'px',
          height: '0.1px',
          width: width + 'px',
          backgroundColor: 'black',
        }}
      />
    )
  }

  for (let i = 0; i <= numOfCells; i++) {
    columns.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: (width / numOfCells) * i + 'px',
          top: '0px',
          height: height + 'px',
          width: '0.1px',
          backgroundColor: 'black',
        }}
      />
    )
  }

  return { rows: rows, columns: columns }
}

export function pathTo(node) {
  var curr = node
  var path = []
  while (curr.parent) {
    path.unshift(curr)
    curr = curr.parent
  }
  return path
}

export function getHeap() {
  return new BinaryHeap(function (node) {
    return node.f
  })
}

export var astar = {
  /**
  * Perform an A* Search on a graph given a start and end node.
  * @param {Graph} graph
  * @param {GridNode} start
  * @param {GridNode} end
  * @param {Object} [options]
  * @param {bool} [options.closest] Specifies whether to return the
             path to the closest node if the target is unreachable.
  * @param {Function} [options.heuristic] Heuristic function (see
  *          astar.heuristics).
  */
  search: function (graph, start, end, options) {
    graph.cleanDirty()
    options = options || {}
    var heuristic = options.heuristic || astar.heuristics.manhattan
    var closest = options.closest || false

    var openHeap = getHeap()
    var closestNode = start // set the start node to be the closest if required

    start.h = heuristic(start, end)
    graph.markDirty(start)

    openHeap.push(start)

    while (openHeap.size() > 0) {
      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop()

      // End case -- result has been found, return the traced path.
      if (currentNode === end) {
        return pathTo(currentNode)
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true

      // Find all neighbors for the current node.
      var neighbors = graph.neighbors(currentNode)

      for (var i = 0, il = neighbors.length; i < il; ++i) {
        var neighbor = neighbors[i]

        if (neighbor.closed || neighbor.isWall()) {
          // Not a valid node to process, skip to next neighbor.
          continue
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        var gScore = currentNode.g + neighbor.getCost(currentNode)
        var beenVisited = neighbor.visited

        if (!beenVisited || gScore < neighbor.g) {
          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true
          neighbor.parent = currentNode
          neighbor.h = neighbor.h || heuristic(neighbor, end)
          neighbor.g = gScore
          neighbor.f = neighbor.g + neighbor.h
          graph.markDirty(neighbor)
          if (closest) {
            // If the neighbour is closer than the current closestNode or if it's equally close but has
            // a cheaper path than the current closest node then it becomes the closest node
            if (
              neighbor.h < closestNode.h ||
              (neighbor.h === closestNode.h && neighbor.g < closestNode.g)
            ) {
              closestNode = neighbor
            }
          }

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor)
          } else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor)
          }
        }
      }
    }

    if (closest) {
      return pathTo(closestNode)
    }

    // No result was found - empty array signifies failure to find path.
    return []
  },
  // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
  heuristics: {
    manhattan: function (pos0, pos1) {
      var d1 = Math.abs(pos1.x - pos0.x)
      var d2 = Math.abs(pos1.y - pos0.y)
      return d1 + d2
    },
    diagonal: function (pos0, pos1) {
      var D = 1
      var D2 = Math.sqrt(2)
      var d1 = Math.abs(pos1.x - pos0.x)
      var d2 = Math.abs(pos1.y - pos0.y)
      return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2)
    },
  },
  cleanNode: function (node) {
    node.f = 0
    node.g = 0
    node.h = 0
    node.visited = false
    node.closed = false
    node.parent = null
  },
}

export function BinaryHeap(scoreFunction) {
  this.content = []
  this.scoreFunction = scoreFunction
}

BinaryHeap.prototype = {
  push: function (element) {
    // Add the new element to the end of the array.
    this.content.push(element)

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1)
  },
  pop: function () {
    // Store the first element so we can return it later.
    var result = this.content[0]
    // Get the element at the end of the array.
    var end = this.content.pop()
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end
      this.bubbleUp(0)
    }
    return result
  },
  remove: function (node) {
    var i = this.content.indexOf(node)

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    var end = this.content.pop()

    if (i !== this.content.length - 1) {
      this.content[i] = end

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i)
      } else {
        this.bubbleUp(i)
      }
    }
  },
  size: function () {
    return this.content.length
  },
  rescoreElement: function (node) {
    this.sinkDown(this.content.indexOf(node))
  },
  sinkDown: function (n) {
    // Fetch the element that has to be sunk.
    var element = this.content[n]

    // When at 0, an element can not sink any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = ((n + 1) >> 1) - 1
      var parent = this.content[parentN]
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element
        this.content[n] = parent
        // Update 'n' to continue at the new position.
        n = parentN
      }
      // Found a parent that is less, no need to sink any further.
      else {
        break
      }
    }
  },
  bubbleUp: function (n) {
    // Look up the target element and its score.
    var length = this.content.length
    var element = this.content[n]
    var elemScore = this.scoreFunction(element)

    while (true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) << 1
      var child1N = child2N - 1
      // This is used to store the new position of the element, if any.
      var swap = null
      var child1Score
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N]
        child1Score = this.scoreFunction(child1)

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N]
        var child2Score = this.scoreFunction(child2)
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap]
        this.content[swap] = element
        n = swap
      }
      // Otherwise, we are done.
      else {
        break
      }
    }
  },
}
