// Ensures all notes besides the active note are not in focus
const changeFocus = (data) => {
  const keys = Object.keys(notes);
  
  if(keys.length > 0) {
    for(let i = 0; i < keys.length; i++) {
      const note = notes[keys[i]];
      
      if(note.hash !== data.hash) {
        note.focus = false;
      }
    }
  }
};

// Add all of the notes in the current room to the notes list
const addAllNotes = (data) => {
  notes = data;
};

// Add the note to the list if it doesn't exist
const updateNoteList = (data) => {
  const note = data;
  note.focus = true;
  if (!notes[data.hash]) {
    notes[data.hash] = note;
    return;
  }
};

// When the user connects, set up socket pipelines
const connectSocket = (e) => {
  socket = io.connect();
  
  socket.on('addedNote', updateNoteList);
  socket.on('joined', addAllNotes);
};

// Updates the greynote's position for drawing to the canvas
const updateGrayNote = (position) => {
  greynote.x = position.x;
  greynote.y = position.y;
};

// Adds the grey note object to the notes list for drawing
const createGrayNote = () => {
  greynote.x = 0;
  greynote.y = 0;
  greynote.radiusx = 50;
  greynote.radiusy = 50;
  greynote.width = 100;
  greynote.height = 100;
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