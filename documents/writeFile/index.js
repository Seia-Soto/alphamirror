const fs = require('fs')

module.exports = (file, data) => {
  const path = __dirname + '../../data/' + encodeURIComponent(file) + '.namu'
  const options = {
    encode: 'utf8'
  }
  if (file || data) {
    return fs.writeFileSync(path, data, options)
      .catch(error => {
        if (error) return false
        return true
      })
  } else {
    throw new Error('Error: cannot find first and second parameter used for file name to check!\n\nAt function documents/writeFile')
  }
}
