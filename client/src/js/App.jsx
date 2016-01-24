import React from 'react'
import MapBox from './MapBox.jsx'
import MapControls from './MapControls.jsx'

export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      maxDistance: 1,
      maxPrice: 1200,
      results: [],
      workAddress: '601 Vallejo St., San Francisco'
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

  // (workAddress: String) => void
  onChangeWorkAddress (workAddress) {
    this.setState(Object.assign({}, this.state, { workAddress }))
  }

  // (results: Array[Object]) => void
  onResultsChanged (results) {
    this.setState(Object.assign({}, this.results, { results }))
  }

  render() {
    return <div>
      <MapBox
        accessToken={ 'pk.eyJ1IjoiYmNoZXJueSIsImEiOiJjaWd6cGdseWoweDNwd3ltMGhsenI1d2tvIn0.jzRreSEiv5JLGK2DcHyuug' }
        maxDistance={this.state.maxDistance}
        maxPrice={this.state.maxPrice}
        mapId={ 'bcherny.e97e6efa' }
        onResultsChanged={this.onResultsChanged.bind(this)}
        workAddress={this.state.workAddress}
      />
      <MapControls
        onChangeMaxDistance={this.onChangeMaxDistance.bind(this)}
        onChangeMaxPrice={this.onChangeMaxPrice.bind(this)}
        onChangeWorkAddress={this.onChangeWorkAddress.bind(this)}
        results={this.state.results}
      />
    </div>
  }

}