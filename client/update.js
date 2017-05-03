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
  setUser(data);
  notes = data.note;
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

//when we receive a character update
const update = (data) => { 
  // add if we do not have that character (based on their id)
  if(!users[data.hash]) {
    users[data.hash] = data;
    return;
  }

  //if we received an old message, just drop it
  if(users[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }
  
  // if the data is this user, don't bother
  if(data.hash === hash) {
    return;
  }

  //grab the character based on the character id we received
  const user = users[data.hash];
  //update their direction and movement information
  //but NOT their x/y since we are animating those
  user.prevX = data.prevX;
  user.prevY = data.prevY;
  user.destX = data.destX;
  user.destY = data.destY;
  user.alpha = 0.25;
};

//function to set this user's character
const setUser = (data) => {
  hash = data.user.hash; //set this user's hash to the unique one they received
  users[hash] = data.user; //set the character by their hash
  
  // get name from when user connected
  let name = document.querySelector("#username").value;
  users[hash].name = name;
  // tell server
  socket.emit('join', { name: name, hash: hash });
  requestAnimationFrame(redraw); //start animating
};


//function to remove a character from our character list
const removeUser = (data) => {
  //if we have that character, remove them
  if(users[data.hash]) {
    delete users[data.hash];
  }
};

// When the user connects, set up socket pipelines
const connectSocket = (e) => {
  socket = io.connect();
  
  //when players move
  socket.on('updatedMovement', update); 
  //when a user leaves
  socket.on('left', removeUser);

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
  note.room = currRoom;
  socket.emit('addNote', note);
};