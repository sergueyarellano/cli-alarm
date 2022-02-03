module.exports = ((state = []) => ({
  getState () { return state },
  setState (newState) { state = newState }
}))()
