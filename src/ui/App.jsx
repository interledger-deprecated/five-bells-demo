import React from 'react'
import { connect } from 'react-redux'

import { Tab, Tabs } from 'material-ui/lib/tabs'
import Log from 'ui/components/Log.jsx'

function mapStateToProps (state) {
  return {}
}
function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component {
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
        <Tab label='Visualization'>456</Tab>
        <Tab label='Log'><Log/></Tab>
      </Tabs>
    </div>
  }
}
