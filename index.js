const express = require('express');
const path = require('path');

const app = express();

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
	res.send('Hello World!');
});

const port = process.env.PORT || 5000;
app.listen(port);

