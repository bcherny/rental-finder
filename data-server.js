import { fetch } from './data-fetcher'
import express from 'express'

const HTTP_PORT = 4002
const AREA = 'sfbay'
const SUBAREAS = ['eby', 'pen', 'sby', 'sfc']

console.info('fetching data...')

// get posts
const state = {
	houses: []
}
fetch(AREA, SUBAREAS).then(hs => {
	console.info(`fetched ${ hs.length } houses`)
	state.houses = hs
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
			res.send(state.houses)
		})
		.get('*', express.static(`${ __dirname }/client/dist`))
		.listen(HTTP_PORT, () => console.info(`started HTTP server on port ${ HTTP_PORT }`))

}