const URL = 'https://data.cityofnewyork.us/api/geospatial/arq3-7z49?method=export&format=GeoJSON'

export function get () {
  return new Promise((resolve, reject) => {
    fetch(URL).then(_ => _.json()).then(({features}) =>
      resolve(features.map(_ => {
        return {
          title: _.properties.name,
          lat: _.geometry.coordinates[1],
          lng: _.geometry.coordinates[0]
        }
      }))
    )
  })
}