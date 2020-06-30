const express = require('express')
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const commentsByPostId = { }

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
});

app.post('/posts/:id/comments', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [] ;
    comments.push({ id, content, status: "pending" });
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://eventbus-srv:6000/events', {
        type: "CommentCreated",
        data: {
            postId: req.params.id,
            status: "pending",
            id,
            content
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const event = req.body;
    console.log('event received:', req.body.type);

    if (event.type == 'CommentModerated') {
        const { postId, id, content, status } = event.data
        const comments = commentsByPostId[postId];
        const commentToUpdate = comments.find(comment => {
            return comment.id === id;
        });
        commentToUpdate.status = status;
        
        await axios.post('http://eventbus-srv:6000/events', {
            type: 'CommentUpdated',
            data: {
                postId,
                id,
                content,
                status
            }
        });
    }

    res.send({});

});

app.listen(4001, () => {
    console.log('listening on port')
});

