
const table = require('text-table')

module.exports = {
  print,
  formatState,
  formatActiveAlarms
}

function print (rows) {
  const t = table(rows)

  process.stdout.write('\u001Bc')
  console.log(t)
  console.log('')
}

function formatState (state) {
  const printableState = state.map((alarm, index) => [index, `${alarm.time.hour}:${alarm.time.minute}`, alarm.message])
  const printable = [['#', 'HH:MM', 'message'], ['-', '-----', '-------']].concat(printableState)
  return printable
}

function formatActiveAlarms (state) {
  return state.map((alarm) => [`${alarm.time.hour}:${alarm.time.minute}`, alarm.message, 'ACTIVE NOW'])
}
