const fs = require('fs')

module.exports = (file) => {
  if (file) {
    fs.existsSync(__dirname + '../../data/' + encodeURIComponent(file) + '.namu')
      .catch(error => {
        if (error) return false
        return true
      })
  } else {
    throw new Error('Error: cannot find first parameter used for file name to check!\n\nAt function documents/ifExists')
  }
}
