// Add all of the notes in the current room to the notes list
const addAllNotes = (data) => {
  notes = data;
};

// Add the note to the list if it doesn't exist
const updateNoteList = (data) => {
  if (!notes[data.hash]) {
    notes[data.hash] = data;
    return;
  }
};

// When the user connects, set up socket pipelines
const connectSocket = (e) => {
  socket = io.connect();
  
  socket.on('addedNote', updateNoteList);
  socket.on('joined', addAllNotes);
};


// Create a note object and add it to the notes list
const addNote = (color, position, text) => {
  let note = {};
  
  switch (color) {
    case 1: // Yellow
      note.color = "yellow";
      break;
    case 2: // Green
      note.color = "greenyellow";
      break;
    case 3: // Blue
      note.color = "deepskyblue";
      break;
    default:  // Default Yellow
      note.color = "yellow";
      break;
   }  
  note.text = text;
  note.position = position;
  note.username = username;
  
  socket.emit('addNote', note);
};