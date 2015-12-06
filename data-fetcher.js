import { chunk, flatten, partition, random } from 'lodash'
import request from 'request-promise'
import sepia from 'sepia'
import ProgressBar from 'progress'
import seq from 'promise-seq'

class House {
	constructor({ lat, lng, posted_on, craigslist_id, price }) {
		Object.assign(this, { lat, lng, posted_on, craigslist_id, price })
	}
}

const getURL = maxPrice => `http://sfbay.craigslist.org/jsonsearch/apa/?max_price=${ maxPrice }`
const getGeoClusterURL = (maxPrice, clusterUrl) => `http://sfbay.craigslist.org${ clusterUrl }&max_price=${ maxPrice }`

// (maxPrice: Number) => Promise[Array[Object]]
function fetchPosts (maxPrice) {
	// console.info(`fetch: <= $${ maxPrice }`)
	return request({ json: true, url: getURL(maxPrice) })
}

// (maxPrice: Number, clusterUrl: String) => Promise[Array[Object]]
function fetchCluster (maxPrice, clusterUrl) {
	// console.info(`fetch cluster: ${ clusterUrl }`)
	return request({ json: true, url: getGeoClusterURL(maxPrice, clusterUrl) })
}

export function fetch (maxPrice) {
	return fetchPosts(maxPrice)
		.then(_ => _[0])
		.then(hs => partition(hs, 'GeoCluster'))
		.then(phs => {

			let bar = new ProgressBar(':bar', { total: phs[0].length })

			// query for clustered posts sequentially, in random chunks of 10-30 at a time
			return seq(
				chunk(phs[0], random(10, 30))
					.map(hs => () => Promise.all(hs.map(h => fetchCluster(maxPrice, h.url).then(h => {
						bar.tick()
						return h
					}))))
			).then(hs => {
				return phs[1].concat(flatten(hs))
			})
		})
		.then(hs => hs.filter(h => h.PostingID).map(h => new House({
			lat: h.Latitude,
			lng: h.Longitude,
			posted_on: (new Date(Number(h.PostedDate)*1000)).toISOString(),
			craigslist_id: Number(h.PostingID),
			price: Number(h.Ask)
		})))
		.catch(e => console.error(e))
}