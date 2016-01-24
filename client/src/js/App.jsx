import React from 'react'
import MapBox from './MapBox.jsx'
import MapControls from './MapControls.jsx'

class ProgressBar extends React.Component {
  render() {
    return <div className="ProgressBar">
      <div className="ProgressBar-Inner" style={{ width: `${100*this.props.elapsed/this.props.total}%` }}></div>
    </div>
  }
}

export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      dataLoader: {
        status: '',
        elapsed: -1,
        total: -1
      },
      maxDistance: 1,
      maxPrice: 1200,
      results: [],
      workAddress: '601 Vallejo St., San Francisco'
    }
  }

  componentDidMount() {
    this.pollForStatus()
  }

  pollForStatus() {
    fetch('/api/status').then(_ => _.json()).then(_ => {
      if (_.elapsed > -1 && _.elapsed == _.total) {
        this.setState(Object.assign({}, this.state, { dataLoader: { status: 'done' } }))
      } else if (_.elapsed > -1) {
        this.setState(Object.assign({}, this.state, { dataLoader: { elapsed: _.elapsed, total: _.total, status: 'loading' } }))
        this.pollAgain()
      } else {
        this.setState(Object.assign({}, this.state, { dataLoader: { status: 'starting' } }))
        this.pollAgain()
      }
    })
  }
  pollAgain() {
    setTimeout(this.pollForStatus.bind(this), 10)
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

    switch (this.state.dataLoader.status) {
      case '': return <div className="LoadingArea"></div>
      case 'starting': return <div className="LoadingArea">Almost ready...</div>
      case 'loading': return <div className="LoadingArea">
          Loaded {this.state.dataLoader.elapsed}/{this.state.dataLoader.total}
          <ProgressBar elapsed={this.state.dataLoader.elapsed} total={this.state.dataLoader.total} />
        </div>
      case 'done': return <div>
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

}