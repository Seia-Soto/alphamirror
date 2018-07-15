const fs = require('fs')

module.exports = (file) => {
  const path = __dirname + '../../data/' + encodeURIComponent(file) + '.namu'
  const encode = 'utf8'
  if (file || encode) {
    fs.readFileSync(path, endcode, (error, data) => {
      if (error) return false
      return data
    })
  } else {
    throw new Error('Error: cannot find first and second parameter used for file name to check!\n\nAt function documents/readFile')
  }
}
