const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios')

const app = express();

app.use(bodyParser.json());
app.use(cors())

/*
{
    "656850d3": {
        "id": "656850d3",
        "title": "Way to go222!",
        "comments": [
            {
                "id": "48598f4d",
                "content": "Way to go222!",
                "status": "pending"
            }
        ]
    }
}
*/
const posts = { } ;

const eventHandler = ( event ) => {
    if(event.type === 'PostCreated') {
        const { id, title } = event.data;
        posts[id] = { id, title, comments: [] };
    } else if(event.type === 'CommentCreated') {
        const {postId, id, content, status} = event.data;
        if(posts[postId] == undefined) {
            console.log('Post doesnt exist')
        } else {
            posts[postId].comments.push({id, content, status});
        }
    } else if(event.type == 'CommentUpdated') {
        const { postId, id, content, status } = event.data
        const commentToUpdate = posts[postId].comments.find(comment => comment.id == id);
        commentToUpdate.content = content
        commentToUpdate.status = status
    }

}

app.get('/posts', (req, res) => {
    res.status(200).send(posts);
})

app.post('/events', (req, res) => {
    const event = req.body;
    console.log('event:', event.type)

    eventHandler(event)
   
    res.status(200).send();
});


app.listen(4002, async () => {
    console.log('listening on port')
    const result = await axios.get('http://eventbus-srv:6000/events');
    for (let event of result.data) {
        console.log('Processing event:', event.type, event.data)
        eventHandler(event)
    }
}); 

