// Checks to see if the user clicked within interactable spaces
const checkClickOnRec = (position, type) => {
  if (currAction === "") {
  
  // Get mouse positions
  const mousex = position.x;
  const mousey = position.y;
  
  let keys;
  
  if (type === 1) {
    keys = Object.keys(notes);
  } else {
    // TODO - FILL IN FOR THREADS
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
      
      if (mousex > rec.x - rec.radiusx && mousex < rec.x + rec.radiusx &&
         mousey > rec.y - rec.radiusy && mousey < rec.y + rec.radiusy) {
        rec.focus = true;
        return rec;
      } else {
        rec.focus = false;
      }
    }
  }
  else return false;
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


// if you press Q, then it will stop the action
const keypress = (e) => { 
  if (e.keyCode === 81) {
      currAction = "";
    }
};

//handler for key up events
const mouseUpHandler = (e) => { 
    // Determines where the user clicked
  const position = getMousePos(e, canvas);
  let posX = position.x - 50;
  let posY = position.y - 60;
  
  let textField = document.querySelector('#tempTextField');

  
  if(canvasBool === 1) {
    //let text = textField.value;
    //textField.value = "";
    
    if(checkClickOnRec(position, 1)) {
      changeFocus(checkClickOnRec(position, 1));
      // Focuses on the note the user clicked on
    } if (currAction === "note") {
      // adds a note
      
      addNote(position, posX, posY);
        objectPlaced = true;
        textField.style.display = 'block';
        textField.style.left = posX + 'px';
        textField.style.top = posY + 'px';
      } if (currAction === "text") {
      // adds a text field
        addTextField(position);
        objectPlaced = true;
        textField.style.display = 'block';
        textField.style.left = posX + 'px';
        textField.style.top = posY + 'px';
    }
  }
  
};

// function from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
const wrapText = (text, x, y, maxWidth, lineHeight) => {
  let words = text.split(' ');
  let line = '';

  for(var n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
        line = testLine;
      }
    }
      ctx.fillText(line, x, y);
}

// calculats the lerp for smooth transition between frames
const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

//handler for key up events
const mouseMoveHandler = (e) => {
  const position = getMousePos(e, canvas);
  if(position) {
    if (!objectPlaced) {
      updateGrayNote(position);
    }
    
    const user = users[hash];

    if (position.x > 0 && position.x < 950 && position.y > 0 && position.y < 500) {
      if (user) {
      user.prevX = user.x;
      user.prevY = user.y;
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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  redraw();
};