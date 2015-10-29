export const ADD_LOG = 'ADD_LOG'

export function addLog (alias, line) {
  // console.log(line)
  return { type: ADD_LOG, alias, line }
}
