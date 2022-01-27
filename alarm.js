const entero = require('entero')
const alarm = require('./db')
const actions = require('./actions')
const { parseAlarm } = require('./format')
const { printAlarmSchedule } = require('./print')
const alert = require('alert')
printAlarmSchedule()

// TODO: crear eventos
async function onLine (line) {
  const newAlarm = parseAlarm(line)
  newAlarm && await alarm.set(newAlarm)
  await printAlarmSchedule()
}

entero({
  prompt: 'set alarm > ',
  onLine,
  commands: {
    help: () => console.log('on my way! \n(っ▀¯▀)つ')
  }
})

setInterval(async () => {
  const date = new Date()
  const hours = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const seconds = date.getSeconds()
  const time = `${hours}:${min}`
  const alarms = JSON.parse(await alarm.get().catch(() => '{}'))

  const alarmNow = alarms[time]

  if (alarmNow) {
    const message = `Hey friend! you have: ${alarmNow.message}, right now`
    !seconds && alert(message)
    !seconds && actions.say(message)
  }
  printAlarmSchedule(time, alarmNow)
}, 1000)
