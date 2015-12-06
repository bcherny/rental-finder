import MapBox from './MapBox.jsx'
import React from 'react'
import ReactDOM from 'react-dom'

console.log('rendering')

ReactDOM.render(
  <MapBox
  	accessToken={ 'pk.eyJ1IjoiYmNoZXJueSIsImEiOiJjaWd6cGdseWoweDNwd3ltMGhsenI1d2tvIn0.jzRreSEiv5JLGK2DcHyuug' }
  	mapId={ 'bcherny.e97e6efa' }
  />,
  document.getElementById('App')
)