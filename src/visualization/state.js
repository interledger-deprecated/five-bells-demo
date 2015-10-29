import _ from 'lodash'
import { EventEmitter } from 'events'
import { greatestLower } from 'visualization/util'

export default class State extends EventEmitter {

  constructor (initialState) {
    super()

    this.initial = initialState

    this.current = _.cloneDeep(initialState)
    this.current.time = 0

    this.checkpoints = []
    this.maxTime = 0
    this.timers = []
  }

  prev (time) {
    return greatestLower(this.checkpoints,
      m => m.time > time)
  }

  runTimers (time) {
    const fire = []
    this.timers = this.timers.filter(function (timer) {
      if (timer.time <= time) {
        fire.push(timer)
        return false
      }
      return true
    })
    fire.forEach(function (timer) {
      timer.callback()
    })
  }

  getMaxTime () {
    return this.maxTime
  }

  init () {
    this.checkpoints.push(_.cloneDeep(this.current))
  }

  fork () {
    const i = this.prev(this.current.time)
    while (this.checkpoints.length - 1 > i) {
      this.checkpoints.pop()
    }
    this.maxTime = this.current.time
    this.timers = []
  }

  rewind (time) {
    this.current = _.cloneDeep(this.checkpoints[this.prev(time)])
    this.current.time = time
    this.runTimers(time)
  }

  base () {
    return this.checkpoints[this.prev(this.current.time)]
  }

  advance (time) {
    this.maxTime = time
    this.current.time = time
    if (this.updater(this)) {
      this.save()
      this.emit('change')
    }
    this.runTimers(time)
  }

  save () {
    this.checkpoints.push(_.cloneDeep(this.current))
  }

  seek (time) {
    if (time <= this.maxTime) {
      this.rewind(time)
    } else if (time > this.maxTime) {
      this.advance(time)
    }
  }

  updater () {
    return false
  }

  exportToString () {
    return JSON.stringify({
      checkpoints: this.checkpoints,
      maxTime: this.maxTime
    })
  }

  importFromString (s) {
    const o = JSON.parse(s)
    this.checkpoints = o.checkpoints
    this.maxTime = o.maxTime
    this.current = _.cloneDeep(this.checkpoints[0])
    this.current.time = 0
    this.timers = []
  }

  clear () {
    this.checkpoints = []
    this.current = this.initial
    this.current.time = 0
    this.maxTime = 0
    this.timers = []
  }

  schedule (time, callback) {
    this.timers.push({time: time, callback: callback})
  }
}
