const test = require('tape')
const { createRows, parseAlarm, formatMeridiem, addIndex } = require('./format')

test('createRows() should format db entries into rows', t => {
  const entries = JSON.parse('{"22:00":{"message":"just an alarm"},"10:00":{"message":"just an alarm"}}')
  const actual = createRows(entries)
  const expected = [
    ['10:00', 'just an alarm'],
    ['22:00', 'just an alarm']
  ]
  t.deepEqual(actual, expected)
  t.end()
})
test('createRows() should sort the rows it produces', t => {
  const entries = JSON.parse('{"22:00":{"message":"just an alarm"},"10:00":{"message":"just an alarm"}, "10:10":{"message":"just an alarm"}}')
  const actual = createRows(entries)
  const expected = [
    ['10:00', 'just an alarm'],
    ['10:10', 'just an alarm'],
    ['22:00', 'just an alarm']
  ]
  t.deepEqual(actual, expected)
  t.end()
})

test('addIndex() should add index to each element', t => {
  const rows = [
    ['10:00', 'just an alarm'],
    ['10:10', 'just an alarm'],
    ['22:00', 'just an alarm']
  ]
  const actual = addIndex(rows)
  const expected = [
    [0, '10:00', 'just an alarm'],
    [1, '10:10', 'just an alarm'],
    [2, '22:00', 'just an alarm']
  ]
  t.deepEqual(actual, expected)
  t.end()
})
test('parseAlarm() should return the alarm hours and minutes when hours and minutes are passed', t => {
  const lines = [
    '10:30 "meeting with waseem"',
    '10.30 "meeting with waseem"',
    '1030 "meeting with waseem"',
    '10 30 "meeting with waseem"',
    '"meeting with waseem" at 1030',
    '"meeting with waseem" at 10.30',
    '"meeting with waseem" at 10:30',
    '"meeting with waseem" 10 30'

  ]
  lines.forEach(line => {
    const actual = parseAlarm(line)
    const expected = { hours: 10, minutes: 30, meridiem: '', message: 'meeting with waseem' }
    t.deepEqual(actual, expected)
  })
  t.end()
})

test('parseAlarm() should return the alarm hours and minutes when hours are passed', t => {
  const lines = [
    '10 "meeting with waseem"',
    '"meeting with waseem" at 10'
  ]
  lines.forEach(line => {
    const actual = parseAlarm(line)
    const expected = { hours: 10, minutes: 0, meridiem: '', message: 'meeting with waseem' }
    t.deepEqual(actual, expected)
  })
  t.end()
})

test('parseAlarm() should return the alarm hours and minutes when hours are passed. am and pm', t => {
  {
    const lines = [
      '10am "meeting with waseem"',
      '"meeting with waseem" at 10am',
      '10 am "meeting with waseem"',
      '"meeting with waseem" at 10 am'
    ]
    lines.forEach(line => {
      const actual = parseAlarm(line)
      const expected = { hours: 10, minutes: 0, meridiem: 'am', message: 'meeting with waseem' }
      t.deepEqual(actual, expected)
    })
  }
  {
    const lines = [
      '10pm "meeting with waseem"',
      '"meeting with waseem" at 10pm',
      '10 pm "meeting with waseem"',
      '"meeting with waseem" at 10 pm'
    ]
    lines.forEach(line => {
      const actual = parseAlarm(line)
      const expected = { hours: 10, minutes: 0, meridiem: 'pm', message: 'meeting with waseem' }
      t.deepEqual(actual, expected)
    })
  }
  t.end()
})

test('formatMeridiem() should return time in am/pm format', t => {
  const times = [
    {
      time: '11:00',
      expected: '11:00 am'
    },
    {
      time: '23:00',
      expected: '11:00 pm'
    },
    {
      time: '13:00',
      expected: '01:00 pm'
    },
    {
      time: '0:00',
      expected: '00:00 am'
    },
    {
      time: '10:35',
      expected: '10:35 am'
    }
  ]
  times.forEach(({ time, expected }) => {
    const actual = formatMeridiem(time)
    t.deepEqual(actual, expected)
  })
  t.end()
})
