const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.post('/events', async (req, res) => {
    const event = req.body;

    console.log('event:', event.type)

    if (event.type === 'CommentCreated') {
        const status = event.data.content.includes('orange') ? 'rejeced' : 'approved'
        const { postId, id, content} = event.data;
        await axios.post('http://eventbus-srv:6000/events', {
            type: "CommentModerated",
            data: {
                postId,
                id,
                content,
                status
            }
        });
    }
    res.send({})
});

app.listen(4003, () => {
    console.log('listening on port:', 4003)
})