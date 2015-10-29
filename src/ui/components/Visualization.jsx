import React from 'react'
import Graph from 'ui/components/Graph.jsx'
import { Toolbar, IconButton, Icons } from 'material-ui'

export default class Visualization extends React.Component {
  constructor () {
    super()
    this.handleSlowMotionClick.bind(this)
  }

  handleSlowMotionClick () {
    console.log('toggle slow motion')
  }

  handleShowCrawlClick () {
    console.log('toggle show crawl')
  }

  render () {
    return <div>
      <Toolbar>
        <IconButton onClick={this.handleSlowMotionClick}>
          <Icons.NavigationMenu/>
        </IconButton>
      </Toolbar>
      <Graph/>
    </div>
  }
}
