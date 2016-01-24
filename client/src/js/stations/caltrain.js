const CALTRAIN_STATIONS = [
  { title: 'San Francisco', lat: 37.7766646, lng: -122.3947062 },
  { title: '22nd St.', lat: 37.7575278, lng: -122.3926874 },
  { title: 'Bayshore', lat: 37.709715, lng: -122.4013705 },
  { title: 'South San Francisco', lat: 37.6575655, lng: -122.4055514 },
  { title: 'San Bruno', lat: 37.632378, lng: -122.412389 },
  { title: 'Millbrae', lat: 37.6003768, lng: -122.3874996 },
  { title: 'Burlingame', lat: 37.5795136, lng: -122.3449288 },
  { title: 'San Mateo', lat: 37.5679943, lng: -122.3239938 },
  { title: 'Hayward Park', lat: 37.5525458, lng: -122.3089987 },
  { title: 'Hillsdale', lat: 37.5370455, lng: -122.2973664 },
  { title: 'Belmont', lat: 37.555225, lng: -122.3172766 },
  { title: 'San Carlos', lat: 37.5075635, lng: -122.2600094 },
  { title: 'Redwood City', lat: 37.4854205, lng: -122.2319197 },
  { title: 'Menlo Park', lat: 37.4545172, lng: -122.1823623 },
  { title: 'Palo Alto', lat: 37.4434248, lng: -122.1651742 },
  { title: 'California Ave.', lat: 37.4291586, lng: -122.1419024 },
  { title: 'San Antonio', lat: 37.407202, lng: -122.1071600 },
  { title: 'Mountain View', lat: 37.3937715, lng: -122.0766438 },
  { title: 'Sunnyvale', lat: 37.3780368, lng: -122.0303662 },
  { title: 'Lawrence', lat: 37.371556, lng: -121.996962 },
  { title: 'Santa Clara', lat: 37.3532523, lng: -121.9365159 },
  { title: 'San Jose Diridon', lat: 37.3299098, lng: -121.9024648 },
  { title: 'Tamien', lat: 37.3112334, lng: -121.8825612 }
]

export function get () {
  return Promise.resolve(CALTRAIN_STATIONS)
}