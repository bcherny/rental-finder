import React from 'react'

export default class MapControls extends React.Component {

	constructor() {
		super()
		this.state = {
			maxDistance: 1,
			maxPrice: 1200
		}
	}

	onChangeMaxDistance ({ target }) {
		const value = Number(target.value)
		this.props.onChangeMaxDistance(value)
		this.setState({ maxDistance: value })
	}

	onChangeMaxPrice ({ target }) {
		const value = Number(target.value)
		this.props.onChangeMaxPrice(value)
		this.setState({ maxPrice: value })
	}

	onChangeWorkAddress ({ target }) {
		this.setState({ workAddress: target.value })
	}

	onSubmitWorkAddress () {
		this.props.onChangeWorkAddress(this.state.workAddress)
	}

	render() {
		return <div className="MapControls">
			<label>
      	Max distance to train/work <input type="range" min="1" max="10" step="1" onChange={this.onChangeMaxDistance.bind(this)} value={this.state.maxDistance} /> {this.state.maxDistance} miles
      </label>
      <label>
      	Max price $<input type="number" min="100" max="20000" step="10" onChange={this.onChangeMaxPrice.bind(this)} value={this.state.maxPrice} />
      </label>
      <label>
      	Work address $<input type="text" value={this.state.workAddress} defaultValue="601 Vallejo St., San Francisco" onChange={this.onChangeWorkAddress.bind(this)} style={{ width: '150px' }} />
      	<button onClick={this.onSubmitWorkAddress.bind(this)}>Update</button>
      </label>
      <label className="pull-right">
      	{this.props.results.length} results
      </label>
    </div>
	}

}