import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './App.jsx'
import demoApp from './reducers'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

let store = createStore(demoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('content')
)
