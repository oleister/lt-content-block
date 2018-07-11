const express = require('express');
const path = require('path');
const request = require('request-promise');
const bp = require('body-parser');

const app = express();
app.use(bp.urlencoded({ extended: false}));
app.use(bp.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/index.html', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/icon.png', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/icon.png'));
});

app.get('/dragIcon.png', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/dragIcon.png'));
});

app.get('/test', (req, res) => {
	var options = {
		method: 'POST',
		uri: 'http://m.ltur.com/core/products/package/products',
		body: {
			"context": {
				"client": 1001,
				"market": 1000,
				"country": "DE",
				"language": "de",
				"currency": "EUR",
				"productType": "PACKAGE",
				"productChannel": "DEFAULT"
			},
			"query": {
				"TRAVELLERS_ADULTS": 2,
				"PRODUCT_GROUPS": [
				3692280
				],
				"TRAVEL_PERIOD_DEPARTURE_DATE": "2018-09-01",
				"TRAVEL_PERIOD_RETURN_DATE": "2018-09-30",
				"PRICE_MIN": 1200,
				"PRICE_MAX": 1800,
				"TRAVEL_PERIOD_DURATION": 11414,
				"FLIGHT_DEPARTURE_AIRPORT_GROUPS": [
				"1000"
				],
				"HOTEL_CATEGORY": 4
			},
			"pagination": {
				"page": 0,
				"size": 6
			}
		},
		json: true // Automatically stringifies the body to JSON
	};
	
	request(options)
		.then(function (parsedBody) {
			console.log(parsedBody);
			res.json(parsedBody);
		})
		.catch(function (err) {
			// POST failed...
		});

	//res.json({stuff:'Hello World'});
});

app.post('/listings', (req, res) => {
	console.log(req.body.test);
	let min = req.body.min;
	let max = req.body.max;
	let resultCount = req.body.resultCount;
	let startDate = req.body.startDate;
	let endDate = req.body.endDate;
	var options = {
		method: 'POST',
		uri: 'http://m.ltur.com/core/products/package/products',
		body: {
			"context": {
				"client": 1001,
				"market": 1000,
				"country": "DE",
				"language": "de",
				"currency": "EUR",
				"productType": "PACKAGE",
				"productChannel": "DEFAULT"
			},
			"query": {
				"TRAVELLERS_ADULTS": 2,
				"PRODUCT_GROUPS": [
				3692280
				],
				"TRAVEL_PERIOD_DEPARTURE_DATE": startDate,
				"TRAVEL_PERIOD_RETURN_DATE": endDate,
				"PRICE_MIN": min,
				"PRICE_MAX": max,
				"TRAVEL_PERIOD_DURATION": 11414,
				"FLIGHT_DEPARTURE_AIRPORT_GROUPS": [
				"1000"
				],
				"HOTEL_CATEGORY": 4
			},
			"pagination": {
				"page": 0,
				"size": resultCount
			}
		},
		json: true // Automatically stringifies the body to JSON
	};
	
	request(options)
		.then(function (parsedBody) {
			console.log(parsedBody);
			res.json(parsedBody);
		})
		.catch(function (err) {
			// POST failed...
		});

	//res.json({stuff:'Hello World'});
});

const port = process.env.PORT || 5000;
app.listen(port);

