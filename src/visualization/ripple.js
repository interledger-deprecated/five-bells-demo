import Network from 'visualization/network'

export default class Ripple extends Network {
  constructor () {
    super()

    this.proposedSet = []
    this.state = 'open'
  }

  updateStates (model) {
    super.updateStates(model)
  }

  startConsensus () {}
}
