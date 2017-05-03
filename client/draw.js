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
  
  //// draws all the users
  //const userKey = Object.keys(users);
  //for(let i = 0; i < userKey.length; i++) {
  //  ctx.save();
  //  const user = users[userKey[i]];
//
//    //if alpha less than 1, increase it by 0.1
//    if(user.alpha < 1) user.alpha += 0.1;
//
//    // calc lerp for both x and y pos
//    user.x = lerp(user.prevX, user.destX, user.alpha);
//    user.y = lerp(user.prevY, user.destY, user.alpha);
//    
//    ctx.fillStyle = user.color;
//    // begin to draw
//    ctx.beginPath();
//    ctx.arc(user.x, user.y, user.rad, 0, 2 * Math.PI, false);
//    // all users set their own color
//    ctx.fill();
//    ctx.closePath();
//    // the second circle to get a cool stroke of a larger radius, for to make the user stand out more from added circles
//    ctx.beginPath();
//    ctx.strokeStyle = strokeColor;
//    ctx.arc(user.x, user.y, user.rad+4, 0, 2 * Math.PI, false);
//    ctx.stroke();
//    ctx.closePath();
//    // draw the name of the user, centered above the user circles
//    ctx.fillStyle = "black";
//    ctx.font = "30px";
//    ctx.textAlign = 'center';
//    ctx.fillText(user.name,user.x, user.y-15);
//    ctx.restore();
//  }

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
