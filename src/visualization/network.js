const MIN_RPC_LATENCY = 10000
const MAX_RPC_LATENCY = 15000

let unique = 0

export default class Network {
  update (model) {
    let dirty = false

    const previousLength = model.messages.length

    this.updateStates(model)

    // Detect if any new messages were sent
    dirty = dirty || model.messages.length !== previousLength

    const deliver = []
    const keep = []
    model.messages.forEach(function (message) {
      if (message.recvTime <= model.time) {
        deliver.push(message)
      } else {
        keep.push(message)
      }
    })

    // Detect if any messages were handled
    dirty = dirty || deliver.length

    model.messages = keep

    // Handle messages to be delivered
    deliver.forEach(message => {
      this.handleMessage(model, message)
    })

    return dirty
  }

  updateStates () {}

  sendMessage (model, message) {
    message.id = 'message' + unique++
    message.sendTime = model.time
    message.recvTime = model.time +
      MIN_RPC_LATENCY +
      Math.random() * (MAX_RPC_LATENCY - MIN_RPC_LATENCY)
    model.messages.push(message)
  }

  handleMessage (model, message) {
    if (message.type === 'ping') {
      this.sendMessage(model, {
        source: message.target,
        target: message.source,
        type: 'pong'
      })
    }
  }

  broadcastMessage (model, node, message) {
    model.nodes.forEach(otherNode => {
      if (otherNode !== node) {
        const msg = _.cloneDeep(message)
        msg.source = node
        msg.target = otherNode
        this.sendMessage(model, msg)
      }
    })
  }
}
