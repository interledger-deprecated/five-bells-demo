export function greatestLower (a, gt) {
  function bs (low, high) {
    if (high < low) {
      return low - 1
    }
    const mid = Math.floor((low + high) / 2)
    if (gt(a[mid])) {
      return bs(low, mid - 1)
    }

    return bs(mid + 1, high)
  }
  return bs(0, a.length - 1)
}

/**
 * Given a set of nodes, will create bi-directions links between all of them.
 */
export function interconnectFully (nodes) {
  nodes.forEach(function (firstNode) {
    if (!Array.isArray(firstNode.advisors)) {
      firstNode.advisors = []
    }
    nodes.forEach(function (secondNode) {
      if (!Array.isArray(secondNode.advisors)) {
        secondNode.advisors = []
      }
      if (firstNode !== secondNode) {
        firstNode.advisors.push(secondNode)
        secondNode.advisors.push(firstNode)
      }
    })
  })

// var initialLinks = [
//   { source: initialNodes[0], target: initialNodes[1], hi: true, lo: true },
//   { source: initialNodes[0], target: initialNodes[2], hi: true, lo: true },
//   { source: initialNodes[0], target: initialNodes[3], hi: true, lo: true },
//   { source: initialNodes[1], target: initialNodes[2], hi: true, lo: true },
//   { source: initialNodes[1], target: initialNodes[3], hi: true, lo: true },
//   { source: initialNodes[2], target: initialNodes[3], hi: true, lo: true },
// ]
}

/**
 * Return a list of links between a set of nodes.
 *
 * Converts this:
 *
 *     [ { }, { advisors: [ <nodes[0]> ]}]
 *
 * To this:
 *
 *     [ { source: <nodes[0]>, target: <nodes[1]> }]
 */
export function generateLinks (nodes, traders) {
  const links = []

  // For all combinations of nodes
  for (let node of nodes) {
    if (node.type === 'ledger') {
      node.count = 0
    }
    if (node.type === 'user') {
      for (let otherNode of nodes) {
        if (otherNode.identity === node.ledger) {
          links.push({
            type: 'user',
            source: node,
            target: otherNode
          })
        }
      }
    }
  }

  for (let node of traders) {
    let source, target
    for (source of nodes) {
      if (source.identity === node.source) {
        break
      }
    }
    for (target of nodes) {
      if (target.identity === node.target) {
        break
      }
    }
    source.count++
    target.count++
    source.radius = 20 + Math.log(source.count + 1) * 36
    target.radius = 20 + Math.log(target.count + 1) * 36
    links.push({
      type: 'trader',
      source: source,
      target: target
    })
  }

  return links
}
