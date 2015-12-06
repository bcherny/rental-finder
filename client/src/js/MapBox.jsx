import React from 'react'
import ReactDOM from 'react-dom'

export default class MapBox extends React.Component {

  constructor (props) {
    console.log('init')
    super (props)
    this.state = {}
  }

  componentDidMount () {
    console.log('mounted!')
    L.mapbox.accessToken = this.props.accessToken

    var map = L.mapbox.map(
      ReactDOM.findDOMNode(this).querySelector('.MapBox'),
      this.props.mapId
    )
  }

  render () {
    return <div className="MapBox"></div>
  }

}

MapBox.propTypes = {
  accessToken: React.PropTypes.string.isRequired,
  mapId: React.PropTypes.string.isRequired
}