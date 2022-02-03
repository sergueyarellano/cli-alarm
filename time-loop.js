const action = require('./actions')
const { getState } = require('./state')
const { eventType } = require('./events')
const { print, formatActiveAlarms } = require('./print')

module.exports = (emitter) => {
  setInterval(async () => {
    // state:
    // [{
    //   time: { hour: '01', minute: '00' },
    //   message: 'hey jude'
    // },
    // ...
    const state = getState()
    const date = new Date()
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const seconds = date.getSeconds()

    const activeAlarms = state
      .map((alarm, index) => ({ ...alarm, index })) // add index for post deletion
      .filter((alarm) => alarm.time.hour === hour && alarm.time.minute === minute)

    // some alarms went off
    if (activeAlarms.length) {
      if (seconds < 10) {
        print(formatActiveAlarms(activeAlarms))
        const activeAlarmMessages = activeAlarms.map(alarm => alarm.message).join(' and ')
        action.say(`You have ${activeAlarmMessages} right now...`)
      } else {
        // delete after X seconds
        const alarmIndexes = activeAlarms.map(alarm => alarm.index)
        emitter.emit(eventType.ALARM_DELETED, alarmIndexes)
      }
    }
  }, 5000)
}
