import React from 'react'

export default class MapControls extends React.Component {

	constructor() {
		super()
		this.state = {
			maxDistance: 1
		}
	}

	onChangeDistance (event) {
		this.setState({ maxDistance: Number(event.target.value) })
		this.props.onChangeDistance(this.state.maxDistance)
	}

	render() {
		return <div className="MapControls">
      Max distance <input type="range" min="1" max="10" step="1" onChange={this.onChangeDistance.bind(this)} value={this.state.maxDistance} /> {this.state.maxDistance} miles
    </div>
	}

}