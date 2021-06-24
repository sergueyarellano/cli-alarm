const table = require('text-table')

module.exports = {
  createRows,
  formatTable,
  getTodayDate,
  parseAlarm,
  formatMeridiem,
  addIndex,
  discardPastAlarms,
  convertMeridiemTime

}

function formatMeridiem (time) {
  function replacer (match, p1, p2, offset, string) {
    const hoursMatch = Number(p1)
    const meridiem = hoursMatch > 11 ? 'pm' : 'am'
    const hours = hoursMatch > 12 ? hoursMatch - 12 : hoursMatch
    return `${String(hours).padStart(2, '0')}:${p2} ${meridiem}`
  }
  return time.replace(/([^:]+):([^:]+)/g, replacer)
}

function discardPastAlarms (rows) {
  return rows.filter(alarm => {
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const formattedTime = `${hours}:${min}`
    return alarm[0] >= formattedTime
  })
}

function convertMeridiemTime (rows) {
  return rows.map(alarm => [formatMeridiem(alarm[0]), alarm[1]])
}

function addIndex (rows) {
  return rows.map((alarm, index) => [index, ...alarm])
}

function createRows (entries) {
  return Object.keys(entries)
    .map((time) => {
      return [time, entries[time].message]
    })
    .sort()
}

function formatTable (title, rows) {
  return table([title].concat([['-', '-----', '-------']]).concat(rows), { align: ['l', 'l', 'l'] })
}

function getTodayDate () {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function parseAlarm (line) {
  const reAlarmTime = /(?<hours>\d{1,2})(?:[:. ])?(?<minutes>\d{1,2})?\s?(?<meridiem>am|pm)?/
  const reMessage = /["](?<message>[^"]+)["]/
  const messageParsed = reMessage.exec(line)
  const message = messageParsed && messageParsed.groups.message
  const timeParsed = reAlarmTime.exec(line)
  const meridiem = timeParsed && timeParsed.groups.meridiem
  const hours = Number(timeParsed.groups.hours)
  const minutes = Number(timeParsed.groups.minutes) || 0

  const schedule = {
    hours,
    minutes,
    meridiem: meridiem || '',
    message: message || 'just an alarm'
  }

  return schedule
}
