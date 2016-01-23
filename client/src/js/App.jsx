import React from 'react'
import MapBox from './MapBox.jsx'
import MapControls from './MapControls.jsx'

export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      maxDistance: 1
    }
  }

  // (maxDistance: Number) => void
  onChangeDistance (maxDistance) {
    this.setState(Object.assign({}, this.state, { maxDistance }))
  }

  render() {
    return <div>
      <MapBox
        accessToken={ 'pk.eyJ1IjoiYmNoZXJueSIsImEiOiJjaWd6cGdseWoweDNwd3ltMGhsenI1d2tvIn0.jzRreSEiv5JLGK2DcHyuug' }
        maxDistance={this.state.maxDistance}
        mapId={ 'bcherny.e97e6efa' }
      />
      <MapControls onChangeDistance={this.onChangeDistance.bind(this)} />
    </div>
  }

}