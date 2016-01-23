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
    this.state = {}
    this.getHouses()
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
    fetch(`/api/houses?max_price=${MAX_PRICE}`).then(_ => _.json()).then(allHouses => {
      console.log(allHouses)

      getTrainStations().then(trainStations => {

        let nearTrain = allHouses.filter(h => trainStations.some(([s, latLng]) => haversineDistance(h.lat, h.lng, latLng[0], latLng[1]) < 1))
        let nearWork = allHouses.filter(h => haversineDistance(h.lat, h.lng, WORK[0], WORK[1]) < 2)

        // near train markers
        nearTrain.forEach(r => {
          L.marker([r.lat, r.lng], {
            icon: L.mapbox.marker.icon({
              'marker-size': 'large',
              'marker-color': '#fa0'
            })
          }).bindPopup(this.generatePopup(r), {
            closeButton: false,
            minWidth: 400
          }).addTo(this.state.map)
        })

        // near work markers
        nearWork.forEach(r => {
          L.marker([r.lat, r.lng], {
            icon: L.mapbox.marker.icon({
              'marker-size': 'large',
              'marker-color': '#088E46'
            })
          }).bindPopup(this.generatePopup(r), {
            closeButton: false,
            minWidth: 400
          }).addTo(this.state.map)
        })

        // caltrain markers
        trainStations.forEach(([s, latLng]) => {
          L.marker(latLng, {
            icon: L.mapbox.marker.icon({
              'marker-size': 'medium',
              'marker-color': '#ccc'
            })
          }).addTo(this.state.map)
        })

        // work marker
        L.marker(WORK, {
          icon: L.mapbox.marker.icon({
            'marker-size': 'medium',
            'marker-color': '#3BB2D0'
          })
        }).addTo(this.state.map)
      })

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

  render () {
    return <div className="MapBox"></div>
  }

}

MapBox.propTypes = {
  accessToken: React.PropTypes.string.isRequired,
  mapId: React.PropTypes.string.isRequired
}