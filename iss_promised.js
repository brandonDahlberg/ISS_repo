const request = require('request-promise-native');
const getIp = 'https://api.ipify.org?format=json'

const fetchMyIp = function() {
  return request('https://api.ipify.org?format=json');
}

const fetchCoordsByIp = function(body) {
  const ip = JSON.parse(body).ip
  return request(`https://freegeoip.app/json/${ip}`);
}

const fetchISSFlyOverTimes = function(body) {
  const { longitude, latitude } = JSON.parse(body)
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`
  return request(url)
}

const nextISSTimesForMyLocation = function() {
  return fetchMyIp()
  .then(fetchCoordsByIp)
  .then(fetchISSFlyOverTimes)
  .then(data => {
    const { response } = JSON.parse(data);
    return response;
  })
}

module.exports = { nextISSTimesForMyLocation }