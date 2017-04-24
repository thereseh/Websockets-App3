// Add the note onto the canvas depending on mouse position and color
const addNote = (color, position, text) => {
  ctx.save();
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowColor = "black";
  ctx.fill();
  switch (color) {
    case 1: // Yellow
      ctx.fillStyle = "yellow";
      ctx.fillRect(position.x - 50, position.y - 50, 100, 100);
      console.log(text);
      break;
    case 2: // Green
      ctx.fillStyle = "greenyellow";
      ctx.fillRect(position.x - 50, position.y - 50, 100, 100);
      console.log("green");
      break;
    case 3: // Blue
      ctx.fillStyle = "deepskyblue";
      ctx.fillRect(position.x - 50, position.y - 50, 100, 100);
      console.log("blue");
      break;
    default:  // Default Yellow
      ctx.fillStyle = "yellow";
      ctx.fillRect(position.x - 50, position.y - 50, 100, 100);
      console.log("yellow");
      break;
   }
  ctx.restore();
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(text, position.x, position.y + 10);
};