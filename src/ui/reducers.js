import { combineReducers } from 'redux'
import { ADD_LOG } from 'ui/actions'

function log (state = [], action) {
  switch (action.type) {
    case ADD_LOG:
      return [{
        alias: action.alias,
        line: action.line
      },
      ...state].slice(0, 30)
    default:
      return state
  }
}

const demoApp = combineReducers({
  log
})

export default demoApp
