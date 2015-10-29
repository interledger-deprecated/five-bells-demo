import { stronglyConnectedComponents } from 'js/graph'

class Analyzer {
  constructor (state) {
    this.state = state

    state.on('change', this.update.bind(this))
    this.update()
  }

  update () {
    // Convert to adjacency list
    // TODO May be more efficient to rewrite the Tarjan's algorithm
    //      to expect a list in the format that we actually use.
    const adjList = this.state.current.nodes.map(node => {
      return (node.advisors || []).map(node => {
        return this.state.current.nodes.indexOf(node)
      })
    })
    const scc = stronglyConnectedComponents(adjList)
    scc.components.sort(function (a, b) {
      return a[a.length - 1] - b[b.length - 1]
    })
    scc.components.forEach((component, i) => {
      component.forEach(nodeId => {
        const node = this.state.current.nodes[nodeId]
        node.color = Analyzer.colors[i % Analyzer.colors.length]
      })
    })
  }
}

Analyzer.colors = [
  '#60BD68', // green
  '#FAA43A', // orange
  '#5DA5DA', // blue
  '#F17CB0', // pink
  '#B2912F', // brown
  '#B276B2', // purple
  '#DECF3F', // yellow
  '#F15854', // red
  '#4D4D4D' // gray
]

export default Analyzer
