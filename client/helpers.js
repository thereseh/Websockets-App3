// Checks to see if the user clicked within interactable spaces
const checkClickOnRec = (position, type) => {
  if (currAction === "" || currAction === "connect" || currAction === "connectNote" ) {
  
  // Get mouse positions
  const mousex = position.x;
  const mousey = position.y;
  
  let keys;
  
  // type is always 1 for now
  if (type === 1) {
    keys = Object.keys(notes);
  }
  
  // Check if user clicked on an interactable space
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      let rec;
      
      if (type === 1) {
        rec = notes[keys[i]];
      } else {
        // TODO - FILL IN FOR THREADS
      }
      
      // for each element, is the mouse within the bounds of the element?
      if (mousex > rec.x - rec.radiusx && mousex < rec.x + rec.radiusx &&
         mousey > rec.y - rec.radiusy && mousey < rec.y + rec.radiusy) {
        // then this element was clicked on
        rec.focus = true;
        
        // return that element
        return rec;
      } else {
        // if this element wasn't clicked on, then make sure focus is set to false
        rec.focus = false;
      }
    }
  } else return false;
  }
};

// Gets the position of the mouse on the canvas
const getMousePos = (e, can) => {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
          
  // get more accurate position on canvas
    let position = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
    return position;
};


// helper method to clear action
const endAction = () => {
  // if we are ending the action while focusing on a textfield, then restore the textfield
  if (currNote.objectType === "textField" && notes[currNote.hash].text === "") {
    notes[currNote.hash].text = tempTextHolder;
  }
  
  currAction = "";
  tempTextHolder = "";
  currNote = {};
  objectPlaced = false;

  // hide "helper" textfields and reset positin to 0
  movingTextField.style.display = "none";
  movingTextField.style.left = 0;
  movingTextField.style.top = 0;
  let fakeTextField = document.querySelector('#fakeTextField');
  fakeTextField.style.zIndex = -1;
  fakeTextField.style.left = 0;
  fakeTextField.style.top = 0;
};

// if you press Q, then it will stop the action
const keypress = (e) => { 
  if (e.keyCode === 81) {
   endAction();
  }
};

//handler for key up events
const mouseUpHandler = (e) => { 
  // Determines where the user clicked
  const position = getMousePos(e, canvas);
  let posX = position.x - 50;
  let posY = position.y - 50;
  
  // always 1 for now
  if(canvasBool === 1) {
    // if the return from this method is true (element is returned)
    if(checkClickOnRec(position, 1)) {
      // add functionality to the focused element
      changeFocus(checkClickOnRec(position, 1));
      
      // if we are currently trying to add a note, and the user have clicked on canvas
      // and the curr object has not been placed yet, then create a note
    } else if (currAction === "note" && !objectPlaced) {
      
      // adjusts the position in case the client is trying to add a note too close
      // to canvas bounds
      if(posX <= 0) {
        position.x = 50;
        greynote.x = position.x;
        posX = position.x - 50;
      }
      if(posX > canvas.width - 150) {
        position.x = canvas.width - 100;
        greynote.x = position.x;
        posX = position.x - 50;
      }
      if(posY <= 0) {
        position.y = 50;
        greynote.y = position.y;
        posY = position.y - 50;
      }
      if(posY > canvas.height - 125) {
        position.y = canvas.height - 50;
        greynote.y = position.y;
        posY = position.y - 50;
      }
      
      // object has been placed, to stop drawing temp sticky note and stuff
      objectPlaced = true;
      // display textfield to be used to add text to the sticky note
      movingTextField.style.display = 'block';
      movingTextField.style.left = posX + 'px';
      movingTextField.style.top = posY + 'px';
      // method to create a note element
      addNote(position, posX, posY);
      
      // if we are currently trying to add a textfield
    } else if (currAction === "text") {
      if(posX > canvas.width - 150) {
        posX = canvas.width - 150;
      }
      if(posY > canvas.height - 125) {
        posY = canvas.height - 125;
      }
      
      // adds a text field
      let fakeTextField = document.querySelector("#fakeTextField")
      fakeTextField.style.zIndex = "0";
      fakeTextField.style.left = "0";
      fakeTextField.style.top = "0";
      // method to create the textfield element
      addTextField(position, posX, posY);
      // object has been placed, so stop moving
      objectPlaced = true;
      movingTextField.style.display = 'block';
      movingTextField.style.left = posX + 'px';
      movingTextField.style.top = posY + 'px';
    } else if (currAction === "connectNotes") {
      // the second note has now been clicked, so clear currAction
      currAction = "";
    }
}
};


// when the client click (down) on elements on the sidebar
const mouseDownSideBar = (e) => {
  // as long as they click on a valid button
  if (socket && e.target.id != "close" && e.target.localName != "h2" && e.target.localName != "p") {
  // emit to the server, to tell other clients that they clicked down
  // so the others can do a fast animation
  let data = {id: e.target.id, room: currRoom};
  socket.emit('clickedDownElement', data);
  }
};

// when the client click (up) on elements on the sidebar
const mouseUpSideBar = (e) => {
  // as long as they click on a valid button
  if (socket && e.target.id != "close" && e.target.localName != "h2" && e.target.localName != "p") {
    
  // emit to the server, to tell other clients that they clicked (now up)
  // so the others can do a fast animation
  let data = {id: e.target.id, room: currRoom};
  socket.emit('clickedUpElement', data);
  }
};

// function from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
const wrapText = (text, x, y, maxWidth, lineHeight, type) => {
  let words = text.split(' ');
  let line = '';
  for(var n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      // only draw shadow is the element is a textField type
      if (type === "textField") {
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
        line = testLine;
      }
    }
    // only draw shadow is the element is a textField type
   if (type === "textField") {
      ctx.shadowColor = "black";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
    }
  ctx.fillText(line, x, y);
};

// calculats the lerp for smooth transition between frames
const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

//handler for key up events
const mouseMoveHandler = (e) => {
  const position = getMousePos(e, canvas);
  // KEEP THOSE NOTES IN THEIR BORDERS
  if(position.x >= canvas.width - 100) {
    position.x = canvas.width - 100;
  } else if (position.x <= 50) {
    position.x = 50;
  }
  if(position.y >= canvas.height - 50) {
    position.y = canvas.height - 50;
  } else if(position.y <= 50) {
    position.y = 50;
  }
  
  if(position) {
    // if we are creating a note, then keep drawing temp note until the user clicks on the canvas
    if (currAction === "note" && !objectPlaced) {
      updateGrayNote(position);
    }
    // if we are creating a textField, then keep updating pos of 
    // fake textfield until the user clicks on the canvas
    if (currAction === "text" && !objectPlaced) {
      updateTempTextField(position);
    }
    // if we are trying to connect notes, keep drawing line from
    // first note to mouse until user clicks on a second note
    if (currAction === "connectNote" && !objectPlaced) {
      createLine(position);
    }
      
    // get user
    const user = users[hash];
    
    // update the position of this user as the client move around canvas
    // emit to all other clients
    if (position.x > 0 && position.x < canvas.width && position.y > 0 && position.y < canvas.height) {
      if (user) {
        //user.x = user.prevX;
        //user.y = user.prevY;
        user.prevX = user.destX;
        user.prevY = user.destY;
        user.destX = position.x;
        user.destY = position.y;
        user.lastUpdate = new Date().getTime();
        user.alpha = 0.3;
        socket.emit('movementUpdate', user);
      }
    }
  }
};

// Resizes the canvas
const resizeCanvas = (e) => {
  canvas.width = Math.floor(window.innerWidth);
  canvas.height = Math.floor(window.innerHeight);
  
  redraw();
};
