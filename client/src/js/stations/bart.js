const URL = 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V'

export function get () {
  return new Promise((resolve, reject) => {
    fetch(URL).then(_ => _.text()).then(_ => {
        const parser = new DOMParser();
        const barts = Array.from(parser.parseFromString(_, 'application/xml').querySelectorAll('station')).map(_ => {
          return [
            _.querySelector('name').innerText,
            [_.querySelector('gtfs_latitude').innerHTML, _.querySelector('gtfs_longitude').innerHTML]
          ]
        })
        resolve(barts)
      })
  })
}