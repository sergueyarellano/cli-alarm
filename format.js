module.exports = {
  formatTime,
  parseTime,
  parseMessage,
  parseAlarmNum
}

function formatTime (time) {
  const hour = time.hour
  const minute = time.minute || '00'

  return {
    hour: hour.padStart(2, '0'),
    minute: minute.padStart(2, '0')
  }
}

function parseTime (line) {
  const reAlarmTime = /(?<hour>\d{1,2})(?:[:. ])?(?<minute>\d{1,2})?\s?/
  const timeParsed = reAlarmTime.exec(line)

  if (!timeParsed) {
    throw new Error('Time passed in incorrect format or not passed')
  }
  const hour = timeParsed.groups.hour
  const minute = timeParsed.groups.minute
  return {
    hour: hour,
    minute: minute
  }
}

function parseMessage (line) {
  const reMessage = /["](?<message>[^"]+)["]/
  const messageResult = reMessage.exec(line)
  const message = messageResult ? messageResult.groups.message : '(╯°□°）╯︵ ┻━┻'

  return message
}

function parseAlarmNum (line) {
  const reMessage = /[#]?(?<message>\d{1,2})$/
  const messageResult = reMessage.exec(line)

  if (!messageResult) {
    throw new Error('You have to provide a number')
  }

  const message = messageResult.groups.message

  return message
}
