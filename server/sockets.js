const xxh = require('xxhashjs');
const Note = require('./classes/Note.js'); // Import Note class

const notes = {}; // Hold the list of notes

let io;

const room = 'room1'; // TODO - Change to whatever "room" they enter

const setupSockets = (ioServer) => {
  io = ioServer;
  
  io.on('connection', (sock) => {
    const socket = sock;
    
    // TODO - Change to whatever "room" they enter
    socket.join(room);
    
    socket.emit('joined', notes);
    
    // Add a note to the note list
    socket.on('addNote', (data) => {
      // Create a unique id for the note
      const noteString = `${data.text}${new Date().getTime()}`;
      const noteHash = xxh.h32(noteString, 0xCAFEBABE).toString(16);
      
      // Create the Note object and add to the list of notes
      let note = new Note(noteHash, data.username, data.position.x, data.position.y, data.text, data.color);
      notes[note.hash] = note;
      
      io.sockets.in(room).emit('addedNote', notes[note.hash]);
    });
  });
};

module.exports.setupSockets = setupSockets;