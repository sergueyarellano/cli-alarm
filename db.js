const level = require('level')
const db = level('my-db')
const { getTodayDate } = require('./format')

module.exports = {
  set,
  get
}

async function set ({ hours, minutes, meridiem, message = 'just an alarm' }) {
  const offset = /pm/.test(meridiem) ? 12 : 0
  const paddedHours = String(hours + offset).padStart(2, '0')
  const paddedMinutes = String(minutes).padStart(2, '0')
  const key = getTodayDate()
  const subKey = `${paddedHours}:${paddedMinutes}`
  const currentSchedule = JSON.parse(await get(key).catch(() => '{}'))
  currentSchedule[subKey] = { message }
  return db.put(key, JSON.stringify(currentSchedule))
}

function get (key = getTodayDate()) {
  return db.get(key).catch(() => '{}')
}
