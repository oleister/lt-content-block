const express = require('express');
const path = require('path');
const request = require('request-promise');
const bp = require('body-parser');
const moment = require('moment');

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
		json: true 
	};
	
	request(options)
		.then(function (parsedBody) {
			console.log(parsedBody);
			res.json(parsedBody);
		})
		.catch(function (err) {
		});
});

app.post('/listings', (req, res) => {
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
		json: true 
	};
	
	request(options)
		.then(function (parsedBody) {
			console.log(parsedBody);
			res.json(parsedBody);
		})
		.catch(function (err) {
		});

});

app.post('/personalisedFeed', (req, res) => {
	console.log(req.body);
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
		json: true 
	};
	
	request(options)
		.then(function (trips) {
			console.log('returned some data');
			let content = '';
			for (let i in trips.products) {
				console.log(trips.products[i]);
				content+= `<div><h2 style="color:#808080;font-family:arial,helvetica,sans-serif;font-size:22px;font-style:normal;font-weight:bold;line-height:1;">${trips.products[i].hotel.location.country.name} nur&nbsp;&nbsp;<b><span style="color:#800000;">${trips.products[i].price.amountTotal} &euro; </span></b></h2><h3 style="color:#808080;font-family:arial,helvetica,sans-serif;font-size:20px;font-style:normal;font-weight:bold;line-height:1;">Ihr Hotel in ${trips.products[i].hotel.location.city.name}&nbsp;ist&nbsp;${trips.products[i].hotel.name} der Kategorie:&nbsp;${trips.products[i].hotel.category}&nbsp;</h3><b><span style="font-size:16px;">Reisedaten für &nbsp;${trips.products[i].travelPeriod.duration} Tage:</span></b><div><span style="font-size:13px;"><b>Abflug:</b></span></div><div><span style="font-size:13px;">${trips.products[i].flight.inbound.arrivalAirport.name} to ${trips.products[i].flight.inbound.departureAirport.name} on ${moment(trips.products[i].flight.inbound.departureDateTime).format('DD-MM-YY')} at ${moment(trips.products[i].flight.inbound.departureDateTime).format('HH:mm')}</span></div><div><span style="font-size:13px;"><b>R&uuml;ckflug:</b></span></div><div><span style="font-size:13px;">${trips.products[i].flight.outbound.arrivalAirport.name} to ${trips.products[i].flight.outbound.departureAirport.name} on ${moment(trips.products[i].flight.outbound.departureDateTime).format('DD-MM-YY')} at ${moment(trips.products[i].flight.outbound.departureDateTime).format('HH:mm')}</span></div></div>`;
			}
			console.log(content);
			res.send(content);
		})
		.catch(function (err) {
		});
});

const port = process.env.PORT || 5000;
app.listen(port);

