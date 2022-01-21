const request = require('request');

const fetchIpApi = `https://api.ipify.org?format=json`;

const nextISSTimesForMyLocation = function (callback) {
	fetchMyIP((error, ip) => {
		if (error) {
			return callback(error, null);
		}

		fetchCoordsByIp(ip, (error, loc) => {
			if (error) {
				return callback(error, null);
			}

			fetchISSFlyOverTimes(loc, (error, nextPasses) => {
				if (error) {
					return callback(error, null);
				}

				callback(null, nextPasses);
			});
		});
	});
};

const fetchMyIP = function (callback) {
	const request = require('request');
	request(fetchIpApi, (error, response, body) => {
		if (error) {
			return callback(error, null);
		}
		if (response.statusCode !== 200) {
			const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
			callback(Error(msg), null);
			return;
		}

		const ipKey = JSON.parse(body);
		const ip = ipKey.ip;
		callback(null, ip);
	});
};

const fetchCoordsByIp = function (ip, callback) {
	request(
		`https://api.freegeoip.app/json/${ip}?apikey=67fe5970-7ad7-11ec-87b4-d1999ba83340`,
		(error, response, body) => {
			if (error) {
				callback(error, null);
				return;
			}

			if (response.statusCode !== 200) {
				const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
				callback(Error(msg), null);
				return;
			}

			const data = JSON.parse(body);
			const latitude = data.latitude;
			const longitude = data.longitude;
			const coords = { latitude, longitude };

			callback(null, coords);
		}
	);
};

const fetchISSFlyOverTimes = function (coords, callback) {
	request(
		`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
		(error, response, body) => {
			if (error) {
				callback(error, null);
				return;
			}
			if (response.statusCode !== 200) {
				const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
				callback(Error(msg), null);
				return;
			}
			const foTimesData = JSON.parse(body);
			callback(null, `Risetime: ${foTimesData.response[0].risetime}, Duration: ${foTimesData.response[0].duration}`);
		}
	);
};

module.exports = { nextISSTimesForMyLocation };
