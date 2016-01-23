import { chunk, flatten, partition, random } from 'lodash'
import request from 'request-promise'
import sepia from 'sepia'
import ProgressBar from 'progress'
import seq from 'promise-seq'

class House {
	constructor(as) {
		Object.assign(this, as)
	}
}

const AREA = 'sfbay'
const SUBAREAS = ['eby', 'pen', 'sby', 'sfc']

const getURLs = maxPrice => flatten(SUBAREAS.map(_ => [
	`http://${AREA}.craigslist.org/jsonsearch/apa/${_}?max_price=${ maxPrice }`,
	`http://${AREA}.craigslist.org/jsonsearch/${_}/roo?max_price=${ maxPrice }`
]))
const getGeoClusterURL = (maxPrice, clusterUrl) => `http://${AREA}.craigslist.org${ clusterUrl }&max_price=${ maxPrice }`

// (maxPrice: Number) => Promise[Array[Object]]
function fetchPosts (maxPrice) {
	// console.info(`fetch: <= $${ maxPrice }`)
	return Promise.all(
		getURLs(maxPrice).map(url => request({ json: true, url }))
	).then(flatten)
}

// (maxPrice: Number, clusterUrl: String) => Promise[Array[Object]]
function fetchCluster (maxPrice, clusterUrl) {
	// console.info(`fetch cluster: ${ clusterUrl }`)
	return request({ json: true, url: getGeoClusterURL(maxPrice, clusterUrl) })
}

// (urls: String) => Array[String]
function getPhotos (urls) {
	return urls
		.slice(urls.lastIndexOf('/') + 1, -11)
		.split(',')
		.map(u => u.replace(':0', ''))
		.map(u => `http://images.craigslist.org/${ u }_300x300.jpg`)
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
			price: Number(h.Ask),
			title: h.PostingTitle,
			url: h.PostingURL,
			photos: h.ImageThumb ? getPhotos(h.ImageThumb) : [],
			type: h.PostingURL.includes('/roo/') ? 'room' : 'apt'
		})))
		// TODO: put results in db
		.catch(e => console.error(e))
}