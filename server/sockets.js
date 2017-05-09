const xxh = require('xxhashjs');
const Note = require('./classes/Note.js'); // Import Note class
const User = require('./classes/User.js'); // Import User class
const TextField = require('./classes/TextField.js'); // Import TextField class


// containers for each room
const notes1 = {};
const notes2 = {};
const notes3 = {};

// users
const users = {};

// some random color to start off with
const colors = ['#4ECDC4', '#FF6B6B', '#313638', '#FFE66D', '#AA80FF', '#ADEBAD', '#FFCC66',
  '#FF3399', '#0066CC'];

let io;

// it changes depending on topic
let room = 'room1';

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;


    // when the user picks a topic to enter
    socket.on('enterRoom', (data) => {
      console.log(data);
      room = data.room;
      socket.join(room);

      const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

      // get a random color from array
      const color = Math.floor(Math.random() * colors.length);

      users[hash] = new User(hash, colors[color]);

      // add the id to the user's socket object for quick reference
      socket.hash = hash;
      
      io.sockets.in(room).emit('joined', {note: notes1, user: users[hash] });

      //if (room === 'room1') {
      //  socket.emit('joined', { note: notes1, user: users[hash] });
      //} else if (room === 'room2') {
      //  socket.emit('joined', { note: notes2, user: users[hash] });
      //} else if (room === 'room3') {
      //  socket.emit('joined', { note: notes2, user: users[hash] });
      //}
    });

    // when this user sends the server a movement update
    socket.on('movementUpdate', (data) => {
      users[socket.hash] = data;
      io.sockets.in('room1').emit('updatedMovement', users[socket.hash]);
    });

    // Add a note to the note list
    socket.on('addNote', (data) => {
      // Create a unique id for the note
      const noteString = `${data.text}${new Date().getTime()}`;
      const noteHash = xxh.h32(noteString, 0xCAFEBABE).toString(16);

      // Create the Note object and add to the list of notes
      const note = new Note(noteHash, data.username, data.position.x,
                            data.position.y, data.text,
                            data.color, data.textPosX,
                            data.textPosY, data.room);

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

    socket.on('addTextField', (data) => {
      // Create a unique id for the note
      const noteString = `${data.text}${new Date().getTime()}`;
      const noteHash = xxh.h32(noteString, 0xCAFEBABE).toString(16);

      // Create the Note object and add to the list of notes
      const field = new TextField(noteHash, data.username, data.position.x, data.position.y,
                          data.text, data.color);

      // depending on which room, store and return correct object
      if (data.room === 'room1') {
        notes1[field.hash] = field;
        io.sockets.in(data.room).emit('addedNote', notes1[field.hash]);
      } else if (data.room === 'room2') {
        notes2[field.hash] = field;
        io.sockets.in(data.room).emit('addedNote', notes2[field.hash]);
      } else if (data.room === 'room3') {
        notes3[field.hash] = field;
        io.sockets.in(data.room).emit('addedNote', notes3[field.hash]);
      }
    });

    socket.on('updateNoteText', (data) => {
      // depending on which room, store and return correct object
      if (data.room === 'room1') {
        notes1[data.hash].text = data.text;
        io.sockets.in(data.room).emit('addedNote', notes1[data.hash]);
      } else if (data.room === 'room2') {
        notes2[data.hash].text = data.text;
        io.sockets.in(data.room).emit('addedNote', notes2[data.hash]);
      } else if (data.room === 'room3') {
        notes3[data.hash].text = data.text;
        io.sockets.in(data.room).emit('addedNote', notes3[data.hash]);
      }
    });


     // when the user disconnects
    socket.on('disconnect', () => {
      // let everyone know this user left
      io.sockets.in('room1').emit('left', users[socket.hash]);
      // remove this user from our object
      delete users[socket.hash];
      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
