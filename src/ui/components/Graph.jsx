import React from 'react'
import { findDOMNode } from 'react-dom'
import io from 'socket.io-client'
import Ripple from 'visualization/ripple'
import UI from 'visualization/ui'
import State from 'visualization/state'
import Visualization from 'visualization/visualization'
import Parser from 'visualization/parser'
import Highlighter from 'visualization/highlighter'

const socket = io('http://localhost:5001')

export default class Graph extends React.Component {
  componentDidMount () {
    const state = this.state = window.state = new State({
      nodes: [],
      traders: [],
      messages: [],
      events: new Set()
    })

    const ripple = this.ripple = window.ripple = new Ripple()

    state.updater = function () {
      return ripple.update(this.current)
    }

    // We need to create the analyzer before the visualization, so that things
    // update in the correct order.
    // window.analyzer = new Analyzer(state)

    const viz = this.viz = window.viz =
      new Visualization(state, findDOMNode(this))
    viz.setup()

    const parser = this.parser = window.parser = new Parser(state)

    this.ui = window.ui = new UI(state, viz, parser)

    this.highlighter = window.highlighter =
      new Highlighter(parser, viz)

    let last = null
    function step (timestamp) {
      // if (!playback.isPaused() && last !== null && timestamp - last < 500) {
      let wallMicrosElapsed = (timestamp - last) * 1000
      let speed = 100
      let modelMicrosElapsed = wallMicrosElapsed / speed
      let modelMicros = state.current.time + modelMicrosElapsed
      state.seek(modelMicros)
      // if (modelMicros >= state.getMaxTime() && onReplayDone !== undefined) {
      //   var f = onReplayDone
      //   onReplayDone = undefined
      //   f()
      // }
      // }
      last = timestamp
      window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step)

    this.queue = []
    this.queueTimer = null

    socket.on('clear', this.handleGraphClear.bind(this))
    socket.on('event', this.queueEvent.bind(this))
  }

  processEvent (event) {
    this.parser.parseEvent(event)
    this.viz.tick()
    if (event.type === 'notification') {
      this.viz.updateEvents()
    } else {
      this.viz.start()
      this.viz.resume()
    }
  }

  processQueue () {
    if (this.queueTimer) {
      return
    }

    if (!this.ui.rateLimit) {
      do {
        if (this.queue.length) {
          this.processEvent(this.queue.shift())
        }
      } while (this.queue.length)
    } else if (this.queue.length) {
      this.processEvent(this.queue.shift())
      this.queueTimer = setTimeout(() => {
        this.queueTimer = null
        this.processQueue()
      }, 1000)
    }
  }

  queueEvent (event) {
    if (!this.ui.showCrawl && event && event.type === 'ledgercrawl') {
      return
    }
    this.queue.push(event)
    this.processQueue()
  }

  // Clear is triggered on reconnect, so we can start from a clean slate
  handleGraphClear () {
    // Cancel any currently queued events
    this.queue = []
    // Reset the state to the initial setting
    this.state.clear()
    // Update the visualization
    this.viz.start()
  }
  handleGraphEvent (event) {
    console.log('graph event', event)
    this.queueEvent(event.detail.msg)
  }
  selectPayment (payment) {
    this.highlighter.selectPayment(payment)
  }
  render () {
    return <div/>
  }
}
