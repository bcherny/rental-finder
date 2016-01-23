import React from 'react'
import MapBox from './MapBox.jsx'
import MapControls from './MapControls.jsx'

export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      maxDistance: 1,
      maxPrice: 1200
    }
  }

  // (maxDistance: Number) => void
  onChangeMaxDistance (maxDistance) {
    this.setState(Object.assign({}, this.state, { maxDistance }))
  }

  // (maxPrice: Number) => void
  onChangeMaxPrice (maxPrice) {
    this.setState(Object.assign({}, this.state, { maxPrice }))
  }

  render() {
    return <div>
      <MapBox
        accessToken={ 'pk.eyJ1IjoiYmNoZXJueSIsImEiOiJjaWd6cGdseWoweDNwd3ltMGhsenI1d2tvIn0.jzRreSEiv5JLGK2DcHyuug' }
        maxDistance={this.state.maxDistance}
        maxPrice={this.state.maxPrice}
        mapId={ 'bcherny.e97e6efa' }
      />
      <MapControls onChangeMaxDistance={this.onChangeMaxDistance.bind(this)} onChangeMaxPrice={this.onChangeMaxPrice.bind(this)} />
    </div>
  }

}