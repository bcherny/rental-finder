const dataFetcher = require('./data-fetcher')
const express = require('express')
const winston = require('winston')

const fetch = dataFetcher.fetch
const getProgress = dataFetcher.getProgress

const HTTP_PORT = 4002
const AREA = 'sfbay'
const SUBAREAS = ['eby', 'pen', 'sby', 'sfc']

console.info('fetching data...')

// get posts
const state = {
  houses: []
}

module.exports.fetchData = function fetchData () {
  return fetch(AREA, SUBAREAS).then(hs => {
    console.info(`fetched ${ hs.length } houses`)
    state.houses = hs
  })
}

module.exports.startServer = function startServer (httpPort) {

  const port = httpPort || HTTP_PORT

  console.info('starting server...')

  return new Promise(resolve =>
    express()
      .use((req, res, next) => {
        winston.info(req.method, req.path, {
          time: new Date().toString(),
          ip: req.ip,
          query: req.query
        })
        next()
      })
      .get('/api/status', (req, res) => {
        res.send(getProgress())
      })
      .get('/api/houses', (req, res) => {
        res.send(state.houses)
      })
      .get('*', express.static(`${ __dirname }/client/dist`))
      .listen(port, () => {
        console.info(`started HTTP server on port ${ port }`)
        resolve()
      })
  )

}