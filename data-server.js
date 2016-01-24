import { fetch, getProgress } from './data-fetcher'
import express from 'express'

const HTTP_PORT = 4002
const AREA = 'sfbay'
const SUBAREAS = ['eby', 'pen', 'sby', 'sfc']

console.info('fetching data...')

// get posts
const state = {
	houses: []
}

export function fetchData () {
	return fetch(AREA, SUBAREAS).then(hs => {
		console.info(`fetched ${ hs.length } houses`)
		state.houses = hs
	})
}

export function startServer (httpPort) {

	const port = httpPort || HTTP_PORT

	console.info('starting server...')

	return new Promise(resolve =>
		express()
			.use((req, res, next) => {
				console.info(req.method, req.path, req.query)
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