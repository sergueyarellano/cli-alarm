
const { getState, setState } = require('./state')
const { print, formatState } = require('./print')

const eventType = {
  ALARM_SET: 'ALARM_SET',
  ALARM_DELETED: 'ALARM_DELETED'
}

module.exports = {
  register: (emitter) => {
    emitter.on(eventType.ALARM_SET, onAlarmSet)
    emitter.on(eventType.ALARM_DELETED, onAlarmDeleted)
  },
  eventType
}

function onAlarmSet (alarm) {
  const newState = getState().concat(alarm)

  const sortedState = newState.sort(compare)
  setState(sortedState)
  print(formatState(sortedState))
}

function compare (a, b) {
  if (a.time.hour > b.time.hour) {
    return 1
  }
  if (a.time.hour < b.time.hour) {
    return -1
  }
  if (a.time.minute > b.time.minute) {
    return 1
  }
  if (a.time.minute < b.time.minute) {
    return -1
  }
}

function onAlarmDeleted (alarmIndexes) {
  // filter out the alarm we want to delete
  // eslint-disable-next-line
  const newState = getState().filter((alarm, index) => alarmIndexes.some((alarmIndex) => alarmIndex != index) )

  const sortedState = newState.sort(compare)
  setState(sortedState)
  print(formatState(sortedState))
}
