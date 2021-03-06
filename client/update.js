// Ensures all notes besides the active note are not in focus
const changeFocus = (data) => {
  // we have already clicked on the line button
  // and have now clicked on a note
  if (currAction === "connect") {
    // we are now trying to connec elements
    currAction = "connectNote";
    // get center position of the note we clicked
    tempLine.fromX = data.x;
    tempLine.fromY = data.y;
    // and the hash of the note
    tempLine.fromHash = data.hash;
    
    //if we have already clicked on one note, and is clicking on another
    // which is not the same as the first note
  } if (currAction === "connectNote" && data.hash !== tempLine.fromHash) {
    // we are now connecting 2 notes
    currAction = "connectNotes";
    // get center of the second note
    tempLine.toX = data.x;
    tempLine.toY = data.y;
    tempLine.room = currRoom;
    // get the hash of the second note
    tempLine.toHash = data.hash;
    connectTwoNotes();
    
    // if we are not trying to place anything
  } if (currAction === ""){
    // then we are updating a object
    currAction = "updateNote";
    updateNoteText(data);
  }
  // all other objects, put out of focus
  const keys = Object.keys(notes);
  if(keys.length > 0) {
    for(let i = 0; i < keys.length; i++) {
      const note = notes[keys[i]];
      
      if(note.hash != data.hash) {
        note.focus = false;
      }
    }
  }
};

// tell server to create a line between notes
const connectTwoNotes = () => {
  socket.emit('addLine', tempLine);
};

// updating a object
const updateNoteText = (focusnote) => {
  // make a temp template of the object
  currNote = focusnote;
  // display the textfield
  movingTextField.style.display = "block";
  movingTextField.style.left = "0px";
  movingTextField.style.top = "0px";
  movingTextField.style.left = focusnote.textPosX + "px";
  movingTextField.style.top = focusnote.textPosY + "px";
  // set value of textarea to the existing value
  document.querySelector('#comment').value = focusnote.text;
  // temp store it in case this is a textfield
  tempTextHolder = focusnote.text;
  // empty the text in the note
  focusnote.text = "";
  // display deletion button
  document.querySelector("#deleteNote").style.display = "block";
};

// Add all of the notes in the current room (from server) to the notes list
const addAllNotes = (data) => {
  setUser(data);
  notes = data.note;
};

// Add, or update the note in the list
const updateNoteList = (data) => {
  const note = data;
  note.focus = true;
  notes[note.hash] = note;
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
  user.alpha = 0.1;
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

const removeNote = (data) => {
  //remove note, prompted from server
  if(notes[data]) {
    delete notes[data];
    
    const keys = Object.keys(notes);
    
    // check if any lines are connected to this note, if so, delete that line too
    if(keys.length > 0) {
      for(let i = 0; i < keys.length; i++) {
        const note = notes[keys[i]];
        if (note.objectType === "line") {
          if (note.noteParentFrom === data || note.noteParentTo === data) {
            socket.emit('removeLine', note);
            delete notes[note.hash];
          }
        }
      }
    }
  } 
};

// When the user connects, set up socket pipelines
const connectSocket = (e) => {
  socket = io.connect();
  
  //when players move
  socket.on('updatedMovement', update); 
  //when a user leaves
  socket.on('left', removeUser);
  
  socket.on('removeNote', removeNote);

  socket.on('addedNote', updateNoteList);
  
  socket.on('joined', addAllNotes);
  
  socket.on('objectClickDown', clickDown);
  
  socket.on('objectClickUp', clickUp);
};

// when we get a click down event from the server (another user clicked element)
const clickDown = (id) => {
  $("#"+id).fadeToggle("fast");
};

// when we get a click up event from the server (another user clicked element)
const clickUp = (id) => {
 $("#"+id).fadeToggle("fast");
};

// Updates the greynote's position for drawing to the canvas
const updateGrayNote = (position) => {
  greynote.x = position.x;
  greynote.y = position.y;
};

// creates a temp note to follow mouse when user is about to add a stickynote
const createTempNote = () => {
  greynote.x = 0;
  greynote.y = 0;
  greynote.radiusx = 50;
  greynote.radiusy = 50;
  greynote.width = 100;
  greynote.height = 100;
};

// updates a fake textareafield to follow mouse
const updateTempTextField = (position) => {
  // KEEP THAT DARN TEMPTEXTFIELD IN THE CANVAS
  position.x -= 50;
  position.y -= 50;
  if(position.x <= 0) {
    document.querySelector("#fakeTextField").style.left = (position.x = 0) + "px";
  } else if (position.x >= canvas.width - 150) {
    document.querySelector("#fakeTextField").style.left = (position.x = canvas.width - 150) + "px";
  } else {
    document.querySelector("#fakeTextField").style.left = (position.x) + "px";
  }
  if(position.y <= 0) {
    document.querySelector("#fakeTextField").style.top = (position.y = 0) + "px";
  } else if (position.y >= canvas.height - 100) {
    document.querySelector("#fakeTextField").style.top = (position.y = canvas.height - 100) + "px";
  } else {
    document.querySelector("#fakeTextField").style.top = (position.y) + "px";
  }
};

// displays a fake textareafield to follow mouse
const createTempText = () => {
  document.querySelector("#fakeTextField").style.zIndex = "1";
};

// when user have clicked on first note, this updates end pos of line to follow mouse
const createLine = (position) => {
  tempLine.toX = position.x;
  tempLine.toY = position.y;
};


// Create a note object and add it to the notes list
const addNote = (position, notePosX, notePosY) => {
  currNote = {};
  currNote.color = stickyColor;
  currNote.textPosX = notePosX;
  currNote.textPosY = notePosY;
  currNote.position = position;
  currNote.username = username;
  currNote.room = currRoom;
  currNote.textColor = textColor;
};

// Create a note object and add it to the notes list
const addTextField = (position, notePosX, notePosY) => {
  currNote = {};
  currNote.textColor = textColor;
  currNote.position = position;
  currNote.textPosX = notePosX;
  currNote.textPosY = notePosY;
  currNote.username = username;
  currNote.room = currRoom;
};