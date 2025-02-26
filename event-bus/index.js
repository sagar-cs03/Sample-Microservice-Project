const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const events = []

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event)
    axios.post('http://posts-srv:4000/events', event);
    axios.post('http://comments-srv:4001/events', event);
    axios.post('http://query-srv:4002/events', event);
    axios.post('http://moderation-srv:4003/events', event);
    res.status(201).send({'status': "success"});
});

app.get('/events', (_, res) => {
    res.status(200).send(events);
});

app.listen(6000, () => {
    console.log('listening on port:')
});

