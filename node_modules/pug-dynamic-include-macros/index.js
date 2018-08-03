const fs = require('fs')
const path = require('path')


module.exports = function (inObj) {
  let outStr = ""
  inObj.directories.forEach(v => {
    try {
      let topMixin = `
mixin ${v.name}`
      let files = fs.readdirSync(v.directory)
      if (v.hasOwnProperty('sortFunc')) {
        files = files.sort(v.sortFunc)
      }
      let prefix = v.root ? v.directory.replace(v.root, "") : v.directory
      files.forEach((f, i) => {
        if (v.filter && v.filter[0] !== ":") {
          v.filter = ":" + v.filter
        }
        outStr += `
mixin ${v.name}${i}
  include${v.filter || ""} ${path.join(prefix, f)}`
        topMixin += `
  include${v.filter || ""} ${path.join(prefix, f)}`
      })
    outStr += topMixin
    } catch (e) {
      console.log(e)
    }
  })

  return new Promise((resolve, reject) => {
    fs.writeFile(inObj.mixinFileName, outStr, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(outStr, inObj)
      }
    })
  })
};
