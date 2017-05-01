// Checks to see if the user clicked within interactable spaces
const checkClickOnRec = (position, type) => {
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
         mousey > rec.y - rec.radiusy && mousey < rec.y + radiusy) {
        return rec;
      }
    }
  }
  else return false;
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

//handler for key up events
const mouseUpHandler = (e) => { 
  // Determines where the user clicked
  const position = getMousePos(e, canvas);
  
  if(canvasBool === 1) {
    let text = textField.value;
    textField.value = "";
    
    if(checkClickOnRec(position, 1)) {
      //changeFocus(checkClickOnNote(position));  // Focuses on the note the user clicked on
    } else {
      if(text.trim().length === 0) {
        return;
      }
      addNote(stickyColor, position, text.trim());  // Adds a note if no note was clicked on
    }
  }
  else {  // TODO - Add handler support on thread canvas
  };
};

//handler for key up events
const mouseMoveHandler = (e) => {
  const position = getMousePos(e, canvas);
  drawTransparentNote("gray", position, " ");
};

// Resizes the canvas
const resizeCanvas = (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  redraw();
};