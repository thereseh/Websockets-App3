const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const sockets = require('./sockets.js');
const mongoose = require('mongoose');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/mindmap';

mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to MongoDB');
    throw err;
  }
});

const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../hosted/index.html`));
});

const server = http.createServer(app);
const io = socketio(server);

sockets.setupSockets(io);

server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${PORT}`);
});
