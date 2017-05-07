// Ensures all notes besides the active note are not in focus
const changeFocus = (data) => {
  const keys = Object.keys(notes);
  console.dir(data);
  if(keys.length > 0) {
    for(let i = 0; i < keys.length; i++) {
      const note = notes[keys[i]];
      
      if(note.hash != data.hash) {
        note.focus = false;
      }
    }
  }
  currAction = "updateNote";
  updateNoteText(data);
  currNote = data;
  data.text = "";
};

const updateNoteText = (focusnote) => {
  console.dir(focusnote);
  
  let field = document.querySelector('#tempTextField');
  field.style.display = "block";
  field.style.left = focusnote.textPosX;
  field.style.top = focusnote.textPosY;
  
  let comment = document.querySelector('#comment');
  comment.value = currNote.text;
  
};
// Add all of the notes in the current room to the notes list
const addAllNotes = (data) => {
  setUser(data);
  notes = data.note;
};

// Add the note to the list if it doesn't exist
const updateNoteList = (data) => {
  console.dir(data);
  console.dir(notes);
  const note = data;
  note.focus = true;
  if (!notes[data.hash]) {
    notes[data.hash] = note;
    return;
  } else if (notes[data.hash]) {
    console.dir(data);
    console.dir(notes);
    notes[data.hash] = data;
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
//const createGrayNote = () => {
//  greynote.x = 0;
//  greynote.y = 0;
//  greynote.radiusx = 50;
//  greynote.radiusy = 50;
//  greynote.width = 100;
//  greynote.height = 100;
//};

const createTempNote = () => {
  greynote.x = 0;
  greynote.y = 0;
  greynote.radiusx = 50;
  greynote.radiusy = 50;
  greynote.width = 100;
  greynote.height = 100;
};


// Create a note object and add it to the notes list
const addNote = (position, notePosX, notePosY) => {
  console.log(currRoom);
  currNote = {};
  currNote.color = stickyColor;
  currNote.textPosX = notePosX;
  currNote.textPosY = notePosY;
  currNote.position = position;
  currNote.username = username;
  currNote.room = currRoom;
};

// Create a note object and add it to the notes list
const addTextField = (position) => {
  console.log(currRoom);
  currNote = {};
  currNote.color = "red";
  currNote.position = position;
  currNote.username = username;
  currNote.room = currRoom;
};