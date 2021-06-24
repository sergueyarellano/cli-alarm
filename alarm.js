const entero = require('entero')
const alarm = require('./db')
const actions = require('./actions')
const { parseAlarm } = require('./format')
const { printAlarmSchedule } = require('./print')
// const notifier = require('node-notifier')
printAlarmSchedule()
// notifier.notify('Message');

// const schedule = {
//   '000': [() => { console.log('execute') }]
// }

// TODO: print only next alarms, not all alarms. or gray the ones that passed
async function onLine (line) {
  const newAlarm = parseAlarm(line)
  await alarm.set(newAlarm)
  await printAlarmSchedule()
}

entero({
  prompt: 'set alarm > ',
  onLine,
  commands: {
    help: () => console.log('on my way! \n(っ▀¯▀)つ'),
    show: (...args) => console.log('args passed:', ...args),
    point: () => console.log('oh, what is the point?')
  }
})

setInterval(async () => {
  const date = new Date()
  const hours = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const time = `${hours}:${min}`
  const alarms = JSON.parse(await alarm.get().catch(() => '{}'))

  const alarmNow = alarms[time]
  if (alarmNow) {
    actions.say(`${alarmNow.message} right now`)
  }
  printAlarmSchedule(time, alarmNow)
}, 10000)

// Object
// notifier.notify({
//   title: 'My notification',
//   message: 'Hello, there!'
// });
