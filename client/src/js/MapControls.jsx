import React from 'react'

export default class MapControls extends React.Component {

	constructor() {
		super()
		this.state = {
			maxDistance: 1,
			maxPrice: 1200
		}
	}

	onChangeMaxDistance (event) {
		this.setState({ maxDistance: Number(event.target.value) })
		this.props.onChangeMaxDistance(this.state.maxDistance)
	}

	onChangeMaxPrice (event) {
		this.setState({ maxPrice: Number(event.target.value) })
		this.props.onChangeMaxPrice(this.state.maxPrice)
	}

	render() {
		return <div className="MapControls">
			<label>
      	Max distance <input type="range" min="1" max="10" step="1" onChange={this.onChangeMaxDistance.bind(this)} value={this.state.maxDistance} /> {this.state.maxDistance} miles
      </label>
      <label>
      	Max price $<input type="number" min="100" max="20000" step="10" onChange={this.onChangeMaxPrice.bind(this)} value={this.state.maxPrice} />
      </label>
    </div>
	}

}