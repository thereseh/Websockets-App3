// Checks to see if the user clicked within interactable spaces
const checkClickOnRec = (position, type) => {
  if (currAction === "" || currAction === "connect" || currAction === "connectNote" ) {
  
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
      movingTextField.style.display = "none";
      let fakeTextField = document.querySelector('#fakeTextField');
      fakeTextField.style.zIndex = -1;
      fakeTextField.style.left = 0;
      fakeTextField.style.top = 0;
    }
};

//handler for key up events
const mouseUpHandler = (e) => { 
    // Determines where the user clicked
  const position = getMousePos(e, canvas);
  let posX = position.x - 50;
  let posY = position.y - 50;
  
  if(canvasBool === 1) {
    if(checkClickOnRec(position, 1)) {
      changeFocus(checkClickOnRec(position, 1));
      // Focuses on the note the user clicked on
    } else if (currAction === "note" && !objectPlaced) {
      // adds a note
      if(posX > canvas.width - 150) {
        position.x = canvas.width - 100;
        greynote.x = position.x;
        posX = position.x - 50;
      }
    
      if(posY > canvas.height - 125) {
        position.y = canvas.height - 50;
        greynote.y = position.y;
        posY = position.y - 50;
      }
      objectPlaced = true;
      movingTextField.style.display = 'block';
      movingTextField.style.left = posX + 'px';
      movingTextField.style.top = posY + 'px';
      addNote(position, posX, posY);
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
      addTextField(position, posX, posY);
      objectPlaced = true;
      movingTextField.style.display = 'block';
      movingTextField.style.left = posX + 'px';
      movingTextField.style.top = posY + 'px';
    } else if (currAction === "connectNotes") {
      currActiosn = "";
    }
  }  
};



//handler for key up events
const mouseDownSideBar = (e) => {
  console.log(e.target.localName);
  if (socket && e.target.id != "close" && e.target.localName != "h2" && e.target.localName != "p") {
  let data = {id: e.target.id, room: currRoom};
  socket.emit('clickedDownElement', data);
  }
};
const mouseUpSideBar = (e) => {
    console.log(e.target.localName);
  if (socket && e.target.id != "close" && e.target.localName != "h2" && e.target.localName != "p") {
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
   if (type === "textField") {
      ctx.shadowColor = "black";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
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
    if (currAction === "note" && !objectPlaced) {
      updateGrayNote(position);
    }
    if (currAction === "text" && !objectPlaced) {
      updateTempTextField(position);
    }
    if (currAction === "connectNote" && !objectPlaced) {
      createLine(position);
    }
    
    
    const user = users[hash];
    
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