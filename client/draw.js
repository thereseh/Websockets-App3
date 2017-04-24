// Add the note onto the canvas depending on mouse position and color
const addNote = (color, position) => {  
  switch (color) {
    case 1: // Yellow
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = "black";
      ctx.fill();
      ctx.fillStyle = "yellow";
      ctx.fillRect(position.x - 20, position.y - 20, 40, 40);
      console.log("yellow");
      break;
    case 2: // Green
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = "black";
      ctx.fill();
      ctx.fillStyle = "greenyellow";
      ctx.fillRect(position.x - 20, position.y - 20, 40, 40);
      console.log("green");
      break;
    case 3: // Blue
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = "black";
      ctx.fill();
      ctx.fillStyle = "deepskyblue";
      ctx.fillRect(position.x - 20, position.y - 20, 40, 40);
      console.log("blue");
      break;
    default:  // Default Yellow
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = "black";
      ctx.fill();
      ctx.fillStyle = "yellow";
      ctx.fillRect(position.x - 20, position.y - 20, 40, 40);
      console.log("yellow");
      break;
   }
};