import { fetch } from './data-fetcher'
import express from 'express'

const HTTP_PORT = 4002

const MAX_PRICE = 1000000
const CALTRAIN_STATIONS = {
	'San Francisco': [37.7766646, -122.3947062],
	'22nd St.': [37.7575278, -122.3926874],
	'Bayshore': [37.709715, -122.4013705],
	'South San Francisco': [37.6575655, -122.4055514],
	'San Bruno': [37.632378, -122.412389],
	'Millbrae': [37.6003768, -122.3874996],
	'Burlingame': [37.5795136, -122.3449288],
	'San Mateo': [37.5679943, -122.3239938],
	'Hayward Park': [37.5525458, -122.3089987],
	'Hillsdale': [37.5370455, -122.2973664],
	'Belmont': [37.555225, -122.3172766],
	'San Carlos': [37.5075635, -122.2600094],
	'Redwood City': [37.4854205, -122.2319197],
	'Menlo Park': [37.4545172, -122.1823623],
	'Palo Alto': [37.4434248, -122.1651742],
	'California Ave.': [37.4291586, -122.1419024],
	'San Antonio': [37.407202, -122.1071600],
	'Mountain View': [37.3937715, -122.0766438],
	'Sunnyvale': [37.3780368, -122.0303662],
	'Lawrence': [37.371556, -121.996962],
	'Santa Clara': [37.3532523, -121.9365159],
	'San Jose Diridon': [37.3299098, -121.9024648],
	'Tamien': [37.3112334, -121.8825612]
}

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