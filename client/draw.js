// Redraw to the canvas
const redraw = () => {
  // Background image
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowColor = "black";
  ctx.fill();
  ctx.fillStyle = "silver";
  ctx.fillRect(greynote.x - greynote.radiusx, greynote.y - greynote.radiusy, greynote.width, greynote.height);
  ctx.restore();
  
  const keys = Object.keys(notes);
  
  // Draw each note to the screen
  if(keys.length > 0) {
    for(let i = 0; i < keys.length; i++) {
      const note = notes[keys[i]];
  
      ctx.save();
      if (note.focus) {
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = note.color;
      } else {
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "black";
      }
      ctx.fill();
      ctx.fillStyle = note.color;
      ctx.fillRect(note.x - note.radiusx, note.y - note.radiusy, note.width, note.height);
      ctx.restore();
      ctx.font = "24px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(note.text, note.x, note.y + 10);
      ctx.font = "12px Arial";
      ctx.fillStyle = "gray";
      ctx.textAlign = "right";
      ctx.fillText(note.username, note.x + note.radiusx - 2, note.y + note.radiusy - 2);
    }
  } 
  
  requestAnimationFrame(redraw);
};
