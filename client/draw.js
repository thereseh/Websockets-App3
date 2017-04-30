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
        ctx.fillRect(note.x - 50, note.y - 50, 100, 100);
        ctx.restore();
        ctx.font = "24px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(note.text, note.x, note.y + 10);
        ctx.font = "12px Arial";
        ctx.fillStyle = "gray";
        ctx.textAlign = "right";
        ctx.fillText(note.username, note.x + 48, note.y + 48);
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
