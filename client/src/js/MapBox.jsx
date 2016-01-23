import React from 'react'
import ReactDOM from 'react-dom'
import flatten from 'lodash/flatten'
import { haversineDistance } from 'gc-distance'
import { get as getBartStations } from './stations/bart'
import { get as getCaltrainStations } from './stations/caltrain'

const MAP_CENTER = [37.7809332, -122.4156281]
const MAP_ZOOM = 12
const MAX_PRICE = 1300
const WORK = [37.7809332, -122.4156281]

// (void) => Promise[Array[Array]]
function getTrainStations() {
  return Promise
    .all([getBartStations(), getCaltrainStations()])
    .then(flatten)
}

export default class MapBox extends React.Component {

  constructor (props) {
    super (props)
    this.state = {
      houses: [],
      markers: [],
      trainStations: []
    }
    this.getHouses()
    this.getTrainStations()
  }

  generatePopup (r) {
    return `
      <a target="_blank" class="popup" href="${ r.url }">
        <span class="title">${ r.title }</span><span class="price">$${ r.price }</span>
        ${ r.photos.map(p => `<img src="${p}">`).join('') }
      </a>
    `
  }
 
  getHouses () {
    fetch(`/api/houses?max_price=${MAX_PRICE}`).then(_ => _.json()).then(houses => {
      console.info('got houses!', houses)
      this.setState(Object.assign({}, this.state, { houses }))
    })
  }

  getTrainStations () {
    getTrainStations().then(trainStations => {
      console.info('got train stations!', trainStations)
      this.setState(Object.assign({}, this.state, { trainStations }))
    })
  }

  componentDidMount () {
    L.mapbox.accessToken = this.props.accessToken

    let map = L.mapbox.map(
      ReactDOM.findDOMNode(this),
      this.props.mapId
    )
    map.setView(MAP_CENTER, MAP_ZOOM)

    this.setState({ map: map })
  }

  addMarker (lat, lng, style, popup) {
    const m = L.marker([lat, lng], {
      icon: L.mapbox.marker.icon(style)
    })

    if (popup) m.bindPopup(popup, {
      closeButton: false,
      minWidth: 400
    })

    m.addTo(this.state.map)

    this.state.markers.push(m) // avoid render
  }

  clearMarkers () {
    this.state.markers.forEach(_ => this.state.map.removeLayer(_))
  }

  render () {
    if (!this.state.map) return <div />

    const { maxDistance } = this.props
    const { houses, map, trainStations } = this.state

    this.clearMarkers()

    const nearWork = houses
      .filter(h => haversineDistance(h.lat, h.lng, WORK[0], WORK[1]) < maxDistance)
    const nearTrain = houses
      .filter(h => trainStations.some(([s, latLng]) => haversineDistance(h.lat, h.lng, latLng[0], latLng[1]) < maxDistance))
      .filter(h => nearWork.indexOf(h) < 0)

    // near train markers
    nearTrain.forEach(r => {
      this.addMarker(
        r.lat,
        r.lng,
        { 'marker-size': 'large', 'marker-color': '#fa0' },
        this.generatePopup(r)
      )
    })

    // near work markers
    nearWork.forEach(r => {
      this.addMarker(
        r.lat,
        r.lng,
        { 'marker-size': 'large', 'marker-color': '#088E46' },
        this.generatePopup(r)
      )
    })

    // caltrain markers
    trainStations.forEach(([s, latLng]) => {
      this.addMarker(
        latLng[0],
        latLng[1],
        { 'marker-size': 'medium', 'marker-color': '#ccc' },
        null
      )
    })

    // work marker
    this.addMarker(
      WORK[0],
      WORK[1],
      { 'marker-size': 'medium', 'marker-color': '#3BB2D0' },
      null
    )

    return <div className="MapBox"></div>
  }

}

MapBox.propTypes = {
  accessToken: React.PropTypes.string.isRequired,
  mapId: React.PropTypes.string.isRequired,
  maxDistance: React.PropTypes.number.isRequired
}