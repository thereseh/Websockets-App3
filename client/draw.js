// Redraw to the canvas
const redraw = () => {
  // Background image
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const keys = Object.keys(notes);
  
  // Draw each note to the screen
  if(keys.length > 0) {
    for(let i = 0; i < keys.length; i++) {
      const note = notes[keys[i]];
      
      if(note.color === 'gray') {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "black";
        ctx.fill();
        ctx.fillStyle = "silver";
        ctx.fillRect(note.position.x - 50, note.position.y - 50, 100, 100);
        ctx.restore();
      } else {
        ctx.save();
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "black";
        ctx.fill();
        ctx.fillStyle = note.color;
        ctx.fillRect(note.position.x - 50, note.position.y - 50, 100, 100);
        ctx.restore();
        ctx.font = "24px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(note.text, note.position.x, note.position.y + 10);
        ctx.font = "12px Arial";
        ctx.fillStyle = "gray";
        ctx.textAlign = "right";
        ctx.fillText(username, note.position.x + 48, note.position.y + 48);
      }
    }
  }
  
  requestAnimationFrame(redraw);
};

// Draws a transparent note to the screen
const drawTransparentNote = (color, position, text) => {
  let note = {};
  note.color = "gray";
  note.position = position;
  note.text = " ";
  
  notes[text] = note;
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
  
  // TODO: Change this when we enable socket.io
  notes[text] = note;
};