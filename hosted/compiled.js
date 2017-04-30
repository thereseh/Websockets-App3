"use strict";

// Redraw to the canvas
var redraw = function redraw() {
  // Background image
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var keys = Object.keys(notes);

  // Draw each note to the screen
  if (keys.length > 0) {
    for (var i = 0; i < keys.length; i++) {
      var note = notes[keys[i]];

      if (note.color === 'gray') {
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
var drawTransparentNote = function drawTransparentNote(color, position, text) {
  var note = {};
  note.color = "gray";
  note.position = position;
  note.text = " ";

  notes[text] = note;
};
"use strict";

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
var mouseMoveHandler = function mouseMoveHandler(e) {
  var position = getMousePos(e, canvas);
  drawTransparentNote("gray", position, " ");
};

// Resizes the canvas
var resizeCanvas = function resizeCanvas(e) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  redraw();
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;

// Holds background image and pattern
var background = void 0;
var pattern = void 0;

// Holds username
var username = void 0;

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

// Holds each note
var notes = {};

var init = function init() {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  // Sets information to draw the background
  background = new Image();
  background.src = "http://img06.deviantart.net/49d3/i/2010/245/0/c/pinboard_texture_by_nikky81-d2xuip9.png";
  background.onload = function () {
    pattern = ctx.createPattern(background, 'repeat');
    resizeCanvas();
  };

  // connect to socket
  var connect = document.querySelector("#connect");

  // Event handle for resizing
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
    username = document.querySelector('#username').value;
    console.log('connect');
    document.querySelector('.can').style.display = "block";
    document.querySelector('.login').style.display = "none";
    connectSocket();
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
'use strict';

// Add all of the notes in the current room to the notes list
var addAllNotes = function addAllNotes(data) {
  notes = data;
};

// Add the note to the list if it doesn't exist
var updateNoteList = function updateNoteList(data) {
  if (!notes[data.hash]) {
    notes[data.hash] = data;
    return;
  }
};

// When the user connects, set up socket pipelines
var connectSocket = function connectSocket(e) {
  socket = io.connect();

  socket.on('addedNote', updateNoteList);
  socket.on('joined', addAllNotes);
};

// Create a note object and add it to the notes list
var addNote = function addNote(color, position, text) {
  var note = {};

  switch (color) {
    case 1:
      // Yellow
      note.color = "yellow";
      break;
    case 2:
      // Green
      note.color = "greenyellow";
      break;
    case 3:
      // Blue
      note.color = "deepskyblue";
      break;
    default:
      // Default Yellow
      note.color = "yellow";
      break;
  }
  note.text = text;
  note.position = position;
  note.username = username;

  socket.emit('addNote', note);
};
