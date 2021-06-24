const alarm = require('./db')
const { createRows, formatTable,discardPastAlarms, convertMeridiemTime, addIndex, formatMeridiem } = require('./format')

module.exports = {
  printAlarmSchedule
}

async function printAlarmSchedule (time, alarmNow) {
  const alarms = await alarm.get()
  const formattedRows = addIndex(
    convertMeridiemTime(
      discardPastAlarms(
        createRows(JSON.parse(alarms)))))
        const table = formatTable(['#', 'alarm', 'message'], formattedRows)
  process.stdout.write('\033c')
  console.log('')
  if (alarmNow) {
    console.log(`*  ${formatMeridiem(time)} ALARM: ${alarmNow.message}`)
    console.log('')
  }
  console.log('Time now:', new Date().toLocaleTimeString())
  console.log('')
  console.log(table)
  console.log('')
}
