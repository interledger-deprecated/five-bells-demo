function compareNumbers (a, b) {
  return a - b
}

export function stronglyConnectedComponents (adjList) {
  const numVertices = adjList.length
  const index = new Array(numVertices)
  const lowValue = new Array(numVertices)
  const active = new Array(numVertices)
  const child = new Array(numVertices)
  const scc = new Array(numVertices)
  const sccLinks = new Array(numVertices)

  // Initialize tables
  for (let i = 0; i < numVertices; ++i) {
    index[i] = -1
    lowValue[i] = 0
    active[i] = false
    child[i] = 0
    scc[i] = -1
    sccLinks[i] = []
  }

  // The strongConnect function
  let count = 0
  const components = []
  const sccAdjList = []

  function strongConnect (v) {
    // To avoid running out of stack space, this emulates the recursive
    // behaviour of the normal algorithm, effectively using T as the
    // call stack.
    const S = [v]
    const T = [v]
    index[v] = lowValue[v] = count
    active[v] = true
    count += 1
    while (T.length > 0) {
      v = T[T.length - 1]
      const e = adjList[v]
      // If we're not done iterating over the children, first try
      // finishing that.
      if (child[v] < e.length) {
        // Start where we left off.
        let i
        for (i = child[v]; i < e.length; ++i) {
          const u = e[i]
          if (index[u] < 0) {
            index[u] = lowValue[u] = count
            active[u] = true
            count += 1
            S.push(u)
            T.push(u)
            break
          // First recurse, then continue here (with the same child!).
          // There is a slight change to Tarjan's algorithm here.
          // Normally, after having recursed, we set lowValue like we
          // do for an active child (although some variants of the
          // algorithm do it slightly differently).
          // Here, we only do so if the child we recursed on is still active.
          // The reasoning is that if it is no longer active, it must
          // have had a lowValue equal to its own index, which means
          // that it is necessarily higher than our lowValue.
          } else if (active[u]) {
            lowValue[v] = Math.min(lowValue[v], lowValue[u]) | 0
          }
          if (scc[u] >= 0) {
            // Node v is not yet assigned an scc, but once it is that
            // scc can apparently reach scc[u].
            sccLinks[v].push(scc[u])
          }
        }
        // Remember where we left off.
        child[v] = i
      } else {
        // If we're done iterating over the children, check whether we
        // have an scc.
        // TODO: It /might/ be true that T is always a prefix of S (at
        //       this point!!!), and if so, this could be used here.
        if (lowValue[v] === index[v]) {
          const component = []
          const links = []
          let linkCount = 0
          for (let i = S.length - 1; i >= 0; --i) {
            const w = S[i]
            active[w] = false
            component.push(w)
            links.push(sccLinks[w])
            linkCount += sccLinks[w].length
            scc[w] = components.length
            if (w === v) {
              S.length = i
              break
            }
          }
          components.push(component)
          const allLinks = new Array(linkCount)
          for (let i = 0; i < links.length; i++) {
            for (let j = 0; j < links[i].length; j++) {
              allLinks[--linkCount] = links[i][j]
            }
          }
          sccAdjList.push(allLinks)
        }
        // Now we're finished exploring this particular node (normally
        // corresponds to the return statement)
        T.pop()
      }
    }
  }

  // Run strong connect starting from each vertex
  for (let i = 0; i < numVertices; ++i) {
    if (index[i] < 0) {
      strongConnect(i)
    }
  }

  // Compact sccAdjList
  for (let i = 0; i < sccAdjList.length; i++) {
    let newE
    const e = sccAdjList[i]
    if (e.length === 0) {
      continue
    }
    e.sort(compareNumbers)
    newE = [e[0]]
    for (let j = 1; j < e.length; j++) {
      if (e[j] !== e[j - 1]) {
        newE.push(e[j])
      }
    }
    sccAdjList[i] = newE
  }

  return {
    components: components,
    adjacencyList: sccAdjList
  }
}
