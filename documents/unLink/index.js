const fs = require('fs')

module.exports = (file) => {
  const path = __dirname + '../../data/' + encodeURIComponent(file) + '.namu'
  if (file && require('../ifExists')(path)) {
    return fs.unlinkSync(path)
      .catch(error => {
        if (error) return false
        return true
      })
  } else {
    throw new Error('Error: cannot find first parameter used for file name to check!\n\nAt function documents/unLink')
  }
}
