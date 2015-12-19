import { fetch } from './data-fetcher'
import express from 'express'

const HTTP_PORT = 4003
const MAX_PRICE = 1000000

console.info('fetching data...')

// get posts
let houses = []
fetch(MAX_PRICE).then(hs => {
	console.info(`fetched ${ hs.length } houses`)
	houses = hs
})
startServer()

function startServer () {

	console.info('starting server...')
	express()
		.use((req, res, next) => {
			console.info(req.method, req.path, req.query)
			next()
		})
		.get('/api/houses', (req, res) => {
			res.send(houses.filter(h => h.price <= (Number(req.query.max_price) || MAX_PRICE)))
		})
		.get('*', express.static(`${ __dirname }/client/dist`))
		.listen(HTTP_PORT, () => console.info(`started HTTP server on port ${ HTTP_PORT }`))

}