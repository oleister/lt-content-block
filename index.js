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
				content+= `<table align="left" border="0" cellpadding="8" cellspacing="0" style="width:100%;">
								<tr>
									<td style="background-color: rgb(203, 7, 102);"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;"><span style="color:#FFFFFF;"><b>${trips.products[i].hotel.location.country.name} nur ${trips.products[i].price.amountTotal} &euro;</b></span></span></span>
								</td></tr><tr>
									<td style="background-color: rgb(246, 140, 18);"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:14px;">Ihr Hotel in ${trips.products[i].hotel.location.city.name} ist ${trips.products[i].hotel.name} der Kategorie ${trips.products[i].hotel.category}&nbsp;</span></span>
								</td></tr><tr>
									<td style="background-color: rgb(221, 236, 242); height: 15px;"><b style="font-family: arial, helvetica, sans-serif; font-size: 12px;">Reisedaten f&uuml;r ${trips.products[i].travelPeriod.duration} Tage:</b>
									</td></tr><tr>
									<td style="background-color: rgb(248, 248, 248);"><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;"><b>Abflug</b>:</span><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;">${trips.products[i].flight.inbound.arrivalAirport.name} nach ${trips.products[i].flight.inbound.departureAirport.name} am ${moment(trips.products[i].flight.inbound.departureDateTime).format('DD-MM-YY')} um ${moment(trips.products[i].flight.inbound.departureDateTime).format('HH:mm')} Uhr.</span><br><br style="font-family: arial, helvetica, sans-serif; font-size: 12px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;"><b>R&uuml;ckflug</b>:&nbsp;</span><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;">${trips.products[i].flight.outbound.arrivalAirport.name} nach ${trips.products[i].flight.outbound.departureAirport.name} am ${moment(trips.products[i].flight.outbound.departureDateTime).format('DD-MM-YY')} um ${moment(trips.products[i].flight.outbound.departureDateTime).format('HH:mm')} Uhr.</span>
								</td></tr><tr>
									<td style="background-color: rgb(221, 236, 242);"><b><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:12px;">Unterkunft:</span></span></b>
									</td></tr><tr>
									<td style="background-color: rgb(248, 248, 248);"><span style="font-size:12px;"><span style="font-family:arial,helvetica,sans-serif;">Zimmer:&nbsp;${trips.products[i].hotel.room.name}<br>Verpflegung:&nbsp;</span></span><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;">${trips.products[i].hotel.board.name}</span>
									</td></tr><tr>
									<td style="background-color: rgb(73, 153, 185); text-align: right; height: 3px;">
									</td></tr><tr>
									<td style="text-align: right; height: 5px;">
									</td>
								</tr>
						</table>`
			}
			console.log(content);
			res.send(content);
		})
		.catch(function (err) {
		});
});

const port = process.env.PORT || 5000;
app.listen(port);

