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
  let text = textField.value;
  textField.value = "";
  
  if(text.trim().length === 0) {
    return;
  }
  // Determines where to add the sticky note
  const position = getMousePos(e, canvas);
  addNote(stickyColor, position, text.trim());
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