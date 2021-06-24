const spawn = require('child_process').spawn
module.exports = {
  say
}

function say (message) {
  spawn('say', [message])
}
