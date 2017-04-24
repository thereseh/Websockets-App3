"use strict";

// Add the note onto the canvas depending on mouse position and color
var addNote = function addNote(color, position, text) {
  ctx.save();
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowColor = "black";
  ctx.fill();
  switch (color) {
    case 1:
      // Yellow
      ctx.fillStyle = "yellow";
      ctx.fillRect(position.x - 50, position.y - 50, 100, 100);
      console.log(text);
      break;
    case 2:
      // Green
      ctx.fillStyle = "greenyellow";
      ctx.fillRect(position.x - 50, position.y - 50, 100, 100);
      console.log("green");
      break;
    case 3:
      // Blue
      ctx.fillStyle = "deepskyblue";
      ctx.fillRect(position.x - 50, position.y - 50, 100, 100);
      console.log("blue");
      break;
    default:
      // Default Yellow
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
'use strict';

var canvas = void 0;
var ctx = void 0;

// Holds colors for drawing sticky notes
var ColorEnum = {
  YELLOW: 1,
  GREEN: 2,
  BLUE: 3
};

// Determines which color the sticky note is
var stickyColor = void 0;

// Used to get the value of text
var textField = void 0;

var getMousePos = function getMousePos(e, can) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;

  // get more accurate position on canvas
  var position = {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
  return position;
};

//handler for key up events
var mouseUpHandler = function mouseUpHandler(e) {
  var text = textField.value;
  textField.value = "";

  if (text.trim().length === 0) {
    return;
  }
  // Determines where to add the sticky note
  var position = getMousePos(e, canvas);
  addNote(stickyColor, position, text.trim());
};

//handler for key up events
var mouseMoveHandler = function mouseMoveHandler(e) {};

// When the user connects, set up socket pipelines
var connectSocket = function connectSocket(e) {};

var resizeCanvas = function resizeCanvas(e) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

var init = function init() {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();

  // connect to socket
  var connect = document.querySelector("#connect");

  window.addEventListener('resize', resizeCanvas);

  // mouse event handlers - NOTE: Lines are changed to get events for the canvas
  canvas.addEventListener('mouseup', mouseUpHandler);
  canvas.addEventListener('mousemove', mouseMoveHandler);

  // Event handlers for sidebar
  stickyColor = ColorEnum.YELLOW;
  // Yellow sticky note
  var yellowSticky = document.querySelector('#stickyNote1');
  yellowSticky.addEventListener('click', function () {
    stickyColor = ColorEnum.YELLOW;
  });
  // Green sticky note
  var greenSticky = document.querySelector('#stickyNote2');
  greenSticky.addEventListener('click', function () {
    stickyColor = ColorEnum.GREEN;
  });
  // Blue sticky note
  var blueSticky = document.querySelector('#stickyNote3');
  blueSticky.addEventListener('click', function () {
    stickyColor = ColorEnum.BLUE;
  });

  // Used for getting text
  textField = document.querySelector('#textField');

  // when connecting, display canvas and hide the log in objecs
  connect.addEventListener('click', function () {
    console.log('connect');
    document.querySelector('.can').style.display = "block";
    document.querySelector('.login').style.display = "none";
  });

  $('#close').click(function () {
    $('.sideBar').animate({ width: "0px" }, 500, function () {
      console.log('done');
      $('#toggle').hide();
      $('#open').show();
      $('#close').hide();
    });
  });

  $('#open').click(function () {
    $('.sideBar').animate({ width: "200px" }, 500, function () {
      $('#toggle').show();
      $('#close').show();
      $('#open').hide();
    });
  });
};

window.onload = init;
