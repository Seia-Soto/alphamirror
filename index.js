console.log('Starting up at ' + new Date())
const request = require('request')
const Express = require('express')

const app = Express()

const documents = require('./documents')
const routes = require('./routes')

const wiki = {
  name: 'alphawiki',
  hostName: 'domain.tld'
  docsPath: '/w',
  forceHTTPS: false,
  defaultPage: 'main'
}
const defaultEntry = wiki.hostName + wiki.docsPath + '/'

// NOTE: Initialize the Express application's interpreters and enviroments
app.set('documents', documents)
app.set('wiki', wiki)

app.use(Express.static('public'))

app.get('/w/:selector', route)
app.get((req, res) => {
  response.redirect(defaultEntry + wiki.name + ':' + wiki.defaultPage)
})

const patchLatest = () => {
  try {
    request('https://alphawiki.org/RecentChanges', (error, response, body) => {
      if (error) {
        return documents.readFile('RecentChanges')
      } else {
        return body
      }
    })
  } catch (error) {
    console.log(error)
  }
}
const sourceMigrations = (src) => {
  if (!src) {
    return
  } else {
    src.replace(/알파위키/g, wiki.name)
      .replace(/)
  }
}

setInterval(() => {
  // Code ...
}, 120000)
