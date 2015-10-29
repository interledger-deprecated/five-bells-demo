export default class Highlighter {
  constructor (parser, viz) {
    this.parser = parser
    this.viz = viz
  }

  selectPayment (payment) {
    const offset = 50
    const sender = payment.source_transfer.debits[0].account + '@' +
      payment.source_transfer.debits[0].ledger
    const recipient = payment.destination_transfer.credits[0].account + '@' +
      payment.destination_transfer.credits[0].ledger
    console.log('tap', payment)
    console.log('sender', sender)
    console.log('recipient', recipient)
    const senderNode = this.parser.getNode(sender)
    senderNode.fixed = true
    senderNode.highlighted = true
    senderNode.x = senderNode.px = offset
    senderNode.y = senderNode.py = window.innerHeight / 2

    const recipientNode = this.parser.getNode(recipient)
    recipientNode.fixed = true
    recipientNode.highlighted = true
    recipientNode.x = recipientNode.px = window.innerWidth - offset
    recipientNode.y = recipientNode.py = window.innerHeight / 2

    const events = this.parser.getEventsByPayment(payment.id)
    const affectedHosts = new Set()
    for (let event of events) {
      affectedHosts.add(event.detail.host)
    }
    payment.path.reduce((left, right) => {
      let leftWithoutAsset = left.split('/').slice(1).join('/')
      let rightWithoutAsset = right.split('/').slice(1).join('/')
      affectedHosts.add((leftWithoutAsset < rightWithoutAsset)
        ? leftWithoutAsset + ';' + rightWithoutAsset
        : rightWithoutAsset + ';' + leftWithoutAsset)
      return right
    })
    for (let host of affectedHosts) {
      let node = this.parser.getNode(host)
      if (node) {
        node.highlighted = true
      }
    }

    console.log('payment events', events)
    console.log('affected hosts', affectedHosts)

    this.viz.updateNodes()
    this.viz.updateLinks()
    this.viz.resume()

    this.viz.svg.classed('highlight-mode', true)
  }
}
