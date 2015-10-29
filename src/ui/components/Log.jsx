import React, { PropTypes } from 'react'
import { ansi_to_html } from 'ansi_up'

function processLine (line) {
  return ansi_to_html(line)
}

export const LogLine = ({alias, line}) =>
  <div>{alias}: <span dangerouslySetInnerHTML={{__html: processLine(line)}}/></div>

export default class Log extends React.Component {
  static propTypes = {
    log: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }
  componentDidMount () {
    window.__require('ipc').on('log', (alias, line) => {
      this.props.actions.addLog(alias, line)
    })
  }

  render () {
    const styles = {
      log: {
        fontFamily: '"Droid Sans Mono", Consolas, monospace',
        color: '#333',
        fontSize: 14
      }
    }
    return <div style={styles.log}>{this.props.log.map((entry) => <LogLine {...entry}/>)}</div>
  }
}
