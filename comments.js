// Create web server
// Run: node comments.js

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var redis = require('redis');
var client = redis.createClient();

// Create route for comments
app.get('/comments', function(request, response) {
  client.lrange('comments', 0, -1, function(error, messages) {
    if (error) throw error;
    response.json(messages);
  });
});

// Create route for comments
app.post('/comments', parseUrlencoded, function(request, response) {
  var newComment = request.body;
  client.rpush('comments', newComment.message, function(error, messages) {
    if (error) throw error;
    response.status(201).json(newComment.message);
  });
});

// Create route for comment
app.get('/comments/:id', function(request, response) {
  client.lrange('comments', request.params.id, request.params.id, function(error, messages) {
    if (error) throw error;
    response.json(messages);
  });
});

// Create route for comment
app.delete('/comments/:id', function(request, response) {
  client.lrange('comments', request.params.id, request.params.id, function(error, messages) {
    if (error) throw error;
    client.lrem('comments', 1, messages[0], function(error) {
      if (error) throw error;
      response.status(204).send();
    });
  });
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});