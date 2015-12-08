import React from 'react'
import ReactDOM from 'react-dom'

const WORK = [37.443382, -122.160273]

const CALTRAIN_STATIONS = Object.freeze({
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
})

function getDistanceFromLatLonInKm(lat0,lng0,lat1,lng1) {
}

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
    fetch('/api/houses?max_price=2100').then(_ => _.json()).then(allHouses => {
      console.log(allHouses)

      let nearCaltrain = allHouses.filter(h => Object.keys(CALTRAIN_STATIONS).some(s => distance([h.lat, h.lng], CALTRAIN_STATIONS[s]) < 1))
      let nearWork = allHouses.filter(h => distance([h.lat, h.lng], WORK) < 2)

      // near caltrain markers
      nearCaltrain.forEach(r => {
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
      Object.keys(CALTRAIN_STATIONS).forEach(s => {
        L.marker(CALTRAIN_STATIONS[s], {
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
    console.log('mounted!')
    L.mapbox.accessToken = this.props.accessToken

    let map = L.mapbox.map(
      ReactDOM.findDOMNode(this),
      this.props.mapId
    )
    map.setView([37.4434248, -122.1651742], 12)

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