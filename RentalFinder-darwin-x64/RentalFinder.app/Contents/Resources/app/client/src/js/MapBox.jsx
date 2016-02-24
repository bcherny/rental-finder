import React from 'react'
import ReactDOM from 'react-dom'
import flatten from 'lodash/flatten'
import { haversineDistance } from 'gc-distance'
import { get as getNYSubways } from './stations/ny-subways'

const MAP_CENTER = [40.7390846, -74.0282945]
const MAP_ZOOM = 12
const MAX_PRICE = 1300

const COLORS = {
  APT_NEAR_WORK: '#088E46',
  APT_NEAR_TRAIN: '#088E46',
  ROOM_NEAR_WORK: '#fa0',
  ROOM_NEAR_TRAIN: '#fa0',
  TRAIN_STATION: '#ccc',
  WORK: '#3BB2D0'
}

export default class MapBox extends React.Component {

  constructor (props) {
    super (props)
    this.state = {
      houses: [],
      markers: [],
      trainStations: [],
      workLatLng: null
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

  getTravelTime (lat0, lng0, lat1, lng1) {
    return fetch(`https://api.mapbox.com/distances/v1/mapbox/driving?access_token=${this.props.accessToken}`, {
        body: JSON.stringify({
          coordinates: [
            [lat0, lng0],
            [lat1, lng1]
          ]
        }),
        method: 'post'
      })
      .then(_ => _.json())
      .then(_ => {
        console.log('got dist', _)
        return _
      })
  }

  // (address: String) => Promise[{ lat: Number, lng: Number }]
  geocode (address) {
    return new Promise((resolve, reject) => {
      L.mapbox.geocoder('mapbox.places').query(address, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve({ lat: data.latlng[0], lng: data.latlng[1] })
      })
    })
  }
 
  getHouses () {
    fetch(`/api/houses`).then(_ => _.json()).then(houses => {
      console.info('got houses!', houses)
      this.setState(Object.assign({}, this.state, { houses }))
    })
  }

  getTrainStations() {
    getNYSubways().then(trainStations => {
      console.info('got train stations!', trainStations)
      this.setState(Object.assign({}, this.state, { trainStations }))
    })
  }

  componentDidMount() {
    L.mapbox.accessToken = this.props.accessToken

    let map = L.mapbox.map(
      ReactDOM.findDOMNode(this),
      this.props.mapId
    )
    map.setView(MAP_CENTER, MAP_ZOOM)

    this.setState({ map: map })

    // geocode work address?
    if (this.props.workAddress) {
      this.geocode(this.props.workAddress).then(
        workLatLng => this.setState(Object.assign({}, this.state, { workLatLng }))
      )
    }
  }

  componentDidUpdate() {
    this.state.map.invalidateSize()

    // update results count
    const { nearWork, nearTrain } = this.computeResults()
    this.props.onResultsChanged(flatten(nearTrain, nearWork))
  }

  componentWillReceiveProps (nextProps) {

    // geocode work address?
    if (!this.state.workLatLng || nextProps.workAddress !== this.props.workAddress) {
      this.geocode(nextProps.workAddress).then(
        workLatLng => this.setState(Object.assign({}, this.state, { workLatLng }))
      )
    }

  }

  shouldComponentUpdate (nextProps, nextState) {
    return (nextState.map && !this.state.map)
        || (nextState.houses.length && !this.state.houses.length)
        || (nextState.trainStations.length && !this.state.trainStations.length)
        || (nextState.workLatLng !== this.state.workLatLng)
        || (nextProps.maxDistance !== this.props.maxDistance)
        || (nextProps.maxPrice !== this.props.maxPrice)
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

  computeResults () {
    const { maxDistance, maxPrice } = this.props
    const { houses, trainStations } = this.state

    const nearWork = houses
      .filter(h => h.price <= maxPrice)
      .filter(h => haversineDistance(h.lat, h.lng, this.state.workLatLng.lat, this.state.workLatLng.lng) <= maxDistance)
    const nearTrain = houses
      .filter(h => h.price <= maxPrice)
      .filter(h => trainStations.some(({lat, lng}) => haversineDistance(h.lat, h.lng, lat, lng) <= maxDistance))
      .filter(h => nearWork.indexOf(h) < 0)

    return { nearWork, nearTrain }
  }

  render () {
    if (!this.state.map || !this.state.workLatLng || !this.state.trainStations.length) return <div />

    this.clearMarkers()

    const { maxDistance, maxPrice } = this.props
    const { houses, map, trainStations } = this.state
    const { nearWork, nearTrain } = this.computeResults()

    // near train markers
    nearTrain.forEach(r => {
      this.addMarker(
        r.lat,
        r.lng,
        { 'marker-size': 'large', 'marker-color': r.type == 'room' ? COLORS.ROOM_NEAR_TRAIN : COLORS.APT_NEAR_TRAIN },
        this.generatePopup(r)
      )
    })

    // near work markers
    nearWork.forEach(r => {
      this.addMarker(
        r.lat,
        r.lng,
        { 'marker-size': 'large', 'marker-color': r.type == 'room' ? COLORS.ROOM_NEAR_WORK : COLORS.APT_NEAR_WORK },
        this.generatePopup(r)
      )
    })

    // caltrain markers
    trainStations.forEach(({title, lat, lng}) => {
      this.addMarker(
        lat,
        lng,
        { 'marker-size': 'medium', 'marker-color': COLORS.TRAIN_STATION },
        title
      )
    })

    // work marker
    this.addMarker(
      this.state.workLatLng.lat,
      this.state.workLatLng.lng,
      { 'marker-size': 'medium', 'marker-color': COLORS.WORK },
      'Work'
    )

    return <div className="MapBox"></div>
  }

}

MapBox.propTypes = {
  accessToken: React.PropTypes.string.isRequired,
  mapId: React.PropTypes.string.isRequired,
  maxDistance: React.PropTypes.number.isRequired,
  maxPrice: React.PropTypes.number.isRequired,
  workAddress: React.PropTypes.string
}