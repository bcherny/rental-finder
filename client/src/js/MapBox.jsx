import React from 'react'
import ReactDOM from 'react-dom'

const MAP_CENTER = [40.738694, -74.0277895]
const MAP_ZOOM = 12
const MAX_PRICE = 1300
const WORK = [40.738694, -74.0277895]

const TRAIN_STATIONS = Object.freeze({
  'San Francisco': [37.7766646, -122.3947062],
  '22nd St.': [37.7575278, -122.3926874],
  'Bayshore': [37.709715, -122.4013705]
})

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function distance ([lat0, lng0], [lat1, lng1]) {
  var R = 3961; // Radius of the earth in km
  var dLat = deg2rad(lat1-lat0);  // deg2rad below
  var dLon = deg2rad(lng1-lng0); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat0)) * Math.cos(deg2rad(lat1)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d
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

      let nearTrain = allHouses.filter(h => Object.keys(TRAIN_STATIONS).some(s => distance([h.lat, h.lng], TRAIN_STATIONS[s]) < 1))
      let nearWork = allHouses.filter(h => distance([h.lat, h.lng], WORK) < 2)

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
      Object.keys(TRAIN_STATIONS).forEach(s => {
        L.marker(TRAIN_STATIONS[s], {
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