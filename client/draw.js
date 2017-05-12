// Redraw to the canvas
const redraw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Background image
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (currAction === "note") {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = stickyColor;
    ctx.fillRect(greynote.x - greynote.radiusx, greynote.y - greynote.radiusy, greynote.width, greynote.height);
    ctx.fill();
    ctx.restore();
  }
  if (currAction === "connectNote") {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tempLine.fromX,tempLine.fromY);
    ctx.lineTo(tempLine.toX,tempLine.toY);
    ctx.stroke();
    ctx.restore();
  }
  const keys = Object.keys(notes);
  
  // Draw each note to the screen
  if(keys.length > 0) {
    for(let i = 0; i < keys.length; i++) {
      const note = notes[keys[i]];
       if (note.objectType === "line") {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(note.fromX,note.fromY);
        ctx.lineTo(note.toX,note.toY);
        ctx.stroke();
        ctx.restore();
      }
    }
  for(let i = 0; i < keys.length; i++) {
      const note = notes[keys[i]];
      if (note.objectType === "note") {
        ctx.save();
        if (note.focus) {
          //ctx.shadowBlur = 5;
          //ctx.shadowOffsetX = 2;
          //ctx.shadowOffsetY = 2;
          ctx.shadowColor = "black";
        } else {
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.shadowColor = "black";
      }
      ctx.fill();
      ctx.fillStyle = note.color;
      ctx.fillRect(note.x - note.radiusx, note.y - note.radiusy, note.width, note.height);
      ctx.restore();
      ctx.font = "15px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = note.textColor;
      wrapText(note.text, note.x+2, note.y-25, 85, 18, note.objectType);

      ctx.font = "12px Arial";
      ctx.fillStyle = "gray";
      ctx.textAlign = "right";
      ctx.fillText(note.username, note.x + note.radiusx - 2, note.y + note.radiusy - 2);
      ctx.restore();
    }
  }
    for(let i = 0; i < keys.length; i++) {
      const note = notes[keys[i]];
    if (note.objectType === "textField") {
      ctx.save();
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = note.textColor;
      wrapText(note.text, note.x, note.y, 85, 30, note.objectType);
      ctx.restore();
    }
  }
}
  
   // draws all the users
  const userKey = Object.keys(users);
  for(let i = 0; i < userKey.length; i++) {
    const user = users[userKey[i]];

    if(!(user.hash === hash)) {
      //if alpha less than 1, increase it by 0.1
      if(user.alpha < 1) user.alpha += 0.1;

      // calc lerp for both x and y pos
      user.x = lerp(user.prevX, user.destX, user.alpha);
      user.y = lerp(user.prevY, user.destY, user.alpha);
      
      // draw the name of the user, centered above the user circles
      ctx.fillStyle = "black";
      ctx.font = "15px Arial";
      ctx.textAlign = 'center';
      ctx.fillText(user.name, user.x, user.y-15);
    }
  }
  ctx.restore();
  
  
  requestAnimationFrame(redraw);
};
