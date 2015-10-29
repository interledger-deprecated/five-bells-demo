import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Tab, Tabs } from 'material-ui/lib/tabs'
import Log from 'ui/components/Log.jsx'
import Visualization from 'ui/components/Visualization.jsx'
import * as Actions from 'ui/actions.js'

function select (state) {
  return {
    log: state.log
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

@connect(select, mapDispatchToProps)
export default class App extends React.Component {
  static propTypes = {
    log: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }

  render () {
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      },
      tabs: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      },
      tabContent: {
        flex: 1
      },
      log: {
        background: 'red',
        height: '100%'
      }
    }

    return <div style={styles.container}>
      <Tabs style={styles.tabs} contentContainerStyle={styles.tabContent}>
        <Tab label='Log'><Log log={this.props.log} actions={this.props.actions}/></Tab>
        <Tab label='Visualization'><Visualization/></Tab>
      </Tabs>
    </div>
  }
}
