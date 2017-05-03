const xxh = require('xxhashjs');
const Note = require('./classes/Note.js'); // Import Note class

// containers for each room
const notes1 = {};
const notes2 = {};
const notes3 = {};

let io;

// it changes depending on topic
let room = 'room1';

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;


    socket.on('enterRoom', (data) => {
      room = data.room;
      socket.join(room);
      if (room === 'room1') {
        socket.emit('joined', notes1);
      } else if (room === 'room2') {
        socket.emit('joined', notes2);
      } else if (room === 'room3') {
        socket.emit('joined', notes3);
      }
    });
    // TODO - Change to whatever "room" they enter


    // Add a note to the note list
    socket.on('addNote', (data) => {
      // Create a unique id for the note
      const noteString = `${data.text}${new Date().getTime()}`;
      const noteHash = xxh.h32(noteString, 0xCAFEBABE).toString(16);

      // Create the Note object and add to the list of notes
      const note = new Note(noteHash, data.username, data.position.x, data.position.y,
                          data.text, data.color);

      // depending on which room, store and return correct object
      if (data.room === 'room1') {
        notes1[note.hash] = note;
        io.sockets.in(data.room).emit('addedNote', notes1[note.hash]);
      } else if (data.room === 'room2') {
        notes2[note.hash] = note;
        io.sockets.in(data.room).emit('addedNote', notes2[note.hash]);
      } else if (data.room === 'room3') {
        notes3[note.hash] = note;
        io.sockets.in(data.room).emit('addedNote', notes3[note.hash]);
      }
    });
  });
};

module.exports.setupSockets = setupSockets;
