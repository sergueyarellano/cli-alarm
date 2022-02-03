const entero = require('entero')
const { formatTime, parseTime, parseMessage, parseAlarmNum } = require('./format')
const EventEmitter = require('events')
const emitter = new EventEmitter()
require('./time-loop')(emitter)
const { register, eventType } = require('./events')
register(emitter)

async function onLine (line) {
  const reParseLine = /^(?<command>\w+)\s/
  const parseLineResults = reParseLine.exec(line)
  const command = parseLineResults && parseLineResults.groups.command.toUpperCase()

  switch (command) {
    case 'SET': {
      // parse alarm time and message
      const parsedTime = parseTime(line)
      const time = formatTime(parsedTime)
      const message = parseMessage(line)
      const newAlarm = { time, message }
      // produce the event to update state and print
      emitter.emit(eventType.ALARM_SET, newAlarm)
      break
    }
    case 'DEL': {
      // parse alarm index to be deleted
      const alarmIndex = parseAlarmNum(line)
      emitter.emit(eventType.ALARM_DELETED, [alarmIndex])
      break
    }
    default:
      console.log('Not a command, use /help to list commands')
  }
}

entero({
  prompt: '> ',
  onLine,
  commands: {
    help: () => {
      const set1 = 'set 10:30 "standup"\tcreate an alarm at 10:30'
      const set2 = 'set 14 "fix phone"\tcreate an alarm at 14:00'
      const del1 = 'del 1\t\t\tdelete alarm #1'
      console.log('')
      console.log(set1)
      console.log(set2)
      console.log(del1)
    }
  }
})
