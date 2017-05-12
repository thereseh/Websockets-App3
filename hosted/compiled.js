"use strict";

// Redraw to the canvas
var redraw = function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Background image
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // if we have clicked on one note and is planning to create a connection
  // this will draw from the center of the clicked note to where the mouse is
  if (currAction === "connectNote") {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tempLine.fromX, tempLine.fromY);
    ctx.lineTo(tempLine.toX, tempLine.toY);
    ctx.stroke();
    ctx.restore();
  }

  // all elements from the object of notes
  var keys = Object.keys(notes);

  // Draw each note to the screen
  // had to do several loops to make sure that the layering of object would be correct
  if (keys.length > 0) {
    for (var i = 0; i < keys.length; i++) {
      var note = notes[keys[i]];

      // is this element (note) a line? then draw a line between the center of the two notes
      if (note.objectType === "line") {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(note.fromX, note.fromY);
        ctx.lineTo(note.toX, note.toY);
        ctx.stroke();
        ctx.restore();
      }
    }
    for (var _i = 0; _i < keys.length; _i++) {
      var _note = notes[keys[_i]];

      // is this element (note) a stickynote? then draw a square
      if (_note.objectType === "note") {
        ctx.save();
        // no shadow if the stickynote is in focus to be updated
        if (_note.focus) {
          ctx.shadowColor = "black";
        } else {
          // not in focus, then give 3D effect by adding shadoq
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.shadowColor = "black";
        }
        ctx.fill();
        ctx.fillStyle = _note.color;
        ctx.fillRect(_note.x - _note.radiusx, _note.y - _note.radiusy, _note.width, _note.height);
        ctx.restore();
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = _note.textColor;

        // wrap the text to stay within bounds 
        wrapText(_note.text, _note.x + 2, _note.y - 25, 85, 18, _note.objectType);

        ctx.font = "12px Arial";
        ctx.fillStyle = "gray";
        ctx.textAlign = "right";
        ctx.fillText(_note.username, _note.x + _note.radiusx - 2, _note.y + _note.radiusy - 2);
        ctx.restore();
      }
    }
    for (var _i2 = 0; _i2 < keys.length; _i2++) {
      var _note2 = notes[keys[_i2]];

      // is this element (note) a textfield? then just draw text on the canvas
      if (_note2.objectType === "textField") {
        ctx.save();
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = _note2.textColor;

        // wrap the text to stay within bounds 
        wrapText(_note2.text, _note2.x, _note2.y, 85, 30, _note2.objectType);
        ctx.restore();
      }
    }
  }
  // if we have clicked on one of the sticky note buttons, this draws
  // a temp note to follow the mouse so the user can see what he is gonna place on canvas
  if (currAction === "note") {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = stickyColor;
    ctx.fillRect(greynote.x - greynote.radiusx, greynote.y - greynote.radiusy, greynote.width, greynote.height);
    ctx.fill();
    ctx.restore();
  }

  // draws all the users
  var userKey = Object.keys(users);
  for (var _i3 = 0; _i3 < userKey.length; _i3++) {
    var user = users[userKey[_i3]];

    // but not "self", only shows the name of the other clients
    if (!(user.hash === hash)) {
      //if alpha less than 1, increase it by 0.1
      if (user.alpha < 1) user.alpha += 0.1;

      // calc lerp for both x and y pos
      user.x = lerp(user.prevX, user.destX, user.alpha);
      user.y = lerp(user.prevY, user.destY, user.alpha);

      // draw the name of the user, centered above the user circles
      ctx.fillStyle = "black";
      ctx.font = "15px Arial";
      ctx.textAlign = 'center';
      ctx.fillText(user.name, user.x, user.y - 15);
    }
  }
  ctx.restore();

  requestAnimationFrame(redraw);
};
"use strict";

// Checks to see if the user clicked within interactable spaces
var checkClickOnRec = function checkClickOnRec(position, type) {
  if (currAction === "" || currAction === "connect" || currAction === "connectNote") {

    // Get mouse positions
    var mousex = position.x;
    var mousey = position.y;

    var keys = void 0;

    // type is always 1 for now
    if (type === 1) {
      keys = Object.keys(notes);
    }

    // Check if user clicked on an interactable space
    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        var rec = void 0;

        if (type === 1) {
          rec = notes[keys[i]];
        } else {}
        // TODO - FILL IN FOR THREADS


        // for each element, is the mouse within the bounds of the element?
        if (mousex > rec.x - rec.radiusx && mousex < rec.x + rec.radiusx && mousey > rec.y - rec.radiusy && mousey < rec.y + rec.radiusy) {
          // then this element was clicked on
          rec.focus = true;

          // return that element
          return rec;
        } else {
          // if this element wasn't clicked on, then make sure focus is set to false
          rec.focus = false;
        }
      }
    } else return false;
  }
};

// Gets the position of the mouse on the canvas
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

// helper method to clear action
var endAction = function endAction() {
  // if we are ending the action while focusing on a textfield, then restore the textfield
  if (currNote.objectType === "textField" && notes[currNote.hash].text === "") {
    notes[currNote.hash].text = tempTextHolder;
  }

  currAction = "";
  tempTextHolder = "";
  currNote = {};
  objectPlaced = false;

  // hide "helper" textfields and reset positin to 0
  movingTextField.style.display = "none";
  movingTextField.style.left = 0;
  movingTextField.style.top = 0;
  var fakeTextField = document.querySelector('#fakeTextField');
  fakeTextField.style.zIndex = -1;
  fakeTextField.style.left = 0;
  fakeTextField.style.top = 0;
};

// if you press Q, then it will stop the action
var keypress = function keypress(e) {
  if (e.keyCode === 81) {
    endAction();
  }
};

//handler for key up events
var mouseUpHandler = function mouseUpHandler(e) {
  // Determines where the user clicked
  var position = getMousePos(e, canvas);
  var posX = position.x - 50;
  var posY = position.y - 50;

  // always 1 for now
  if (canvasBool === 1) {
    // if the return from this method is true (element is returned)
    if (checkClickOnRec(position, 1)) {
      // add functionality to the focused element
      changeFocus(checkClickOnRec(position, 1));

      // if we are currently trying to add a note, and the user have clicked on canvas
      // and the curr object has not been placed yet, then create a note
    } else if (currAction === "note" && !objectPlaced) {

      // adjusts the position in case the client is trying to add a note too close
      // to canvas bounds
      if (posX <= 0) {
        position.x = 50;
        greynote.x = position.x;
        posX = position.x - 50;
      }
      if (posX > canvas.width - 150) {
        position.x = canvas.width - 100;
        greynote.x = position.x;
        posX = position.x - 50;
      }
      if (posY <= 0) {
        position.y = 50;
        greynote.y = position.y;
        posY = position.y - 50;
      }
      if (posY > canvas.height - 125) {
        position.y = canvas.height - 50;
        greynote.y = position.y;
        posY = position.y - 50;
      }

      // object has been placed, to stop drawing temp sticky note and stuff
      objectPlaced = true;
      // display textfield to be used to add text to the sticky note
      movingTextField.style.display = 'block';
      movingTextField.style.left = posX + 'px';
      movingTextField.style.top = posY + 'px';
      // method to create a note element
      addNote(position, posX, posY);

      // if we are currently trying to add a textfield
    } else if (currAction === "text") {
      if (posX > canvas.width - 150) {
        posX = canvas.width - 150;
      }
      if (posY > canvas.height - 125) {
        posY = canvas.height - 125;
      }

      // adds a text field
      var fakeTextField = document.querySelector("#fakeTextField");
      fakeTextField.style.zIndex = "0";
      fakeTextField.style.left = "0";
      fakeTextField.style.top = "0";
      // method to create the textfield element
      addTextField(position, posX, posY);
      // object has been placed, so stop moving
      objectPlaced = true;
      movingTextField.style.display = 'block';
      movingTextField.style.left = posX + 'px';
      movingTextField.style.top = posY + 'px';
    } else if (currAction === "connectNotes") {
      // the second note has now been clicked, so clear currAction
      currAction = "";
    }
  }
};

// when the client click (down) on elements on the sidebar
var mouseDownSideBar = function mouseDownSideBar(e) {
  // as long as they click on a valid button
  if (socket && e.target.id != "close" && e.target.localName != "h2" && e.target.localName != "p") {
    // emit to the server, to tell other clients that they clicked down
    // so the others can do a fast animation
    var data = { id: e.target.id, room: currRoom };
    socket.emit('clickedDownElement', data);
  }
};

// when the client click (up) on elements on the sidebar
var mouseUpSideBar = function mouseUpSideBar(e) {
  // as long as they click on a valid button
  if (socket && e.target.id != "close" && e.target.localName != "h2" && e.target.localName != "p") {

    // emit to the server, to tell other clients that they clicked (now up)
    // so the others can do a fast animation
    var data = { id: e.target.id, room: currRoom };
    socket.emit('clickedUpElement', data);
  }
};

// function from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
var wrapText = function wrapText(text, x, y, maxWidth, lineHeight, type) {
  var words = text.split(' ');
  var line = '';
  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      // only draw shadow is the element is a textField type
      if (type === "textField") {
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  // only draw shadow is the element is a textField type
  if (type === "textField") {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
  }
  ctx.fillText(line, x, y);
};

// calculats the lerp for smooth transition between frames
var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

//handler for key up events
var mouseMoveHandler = function mouseMoveHandler(e) {
  var position = getMousePos(e, canvas);
  // KEEP THOSE NOTES IN THEIR BORDERS
  if (position.x >= canvas.width - 100) {
    position.x = canvas.width - 100;
  } else if (position.x <= 50) {
    position.x = 50;
  }
  if (position.y >= canvas.height - 50) {
    position.y = canvas.height - 50;
  } else if (position.y <= 50) {
    position.y = 50;
  }

  if (position) {
    // if we are creating a note, then keep drawing temp note until the user clicks on the canvas
    if (currAction === "note" && !objectPlaced) {
      updateGrayNote(position);
    }
    // if we are creating a textField, then keep updating pos of 
    // fake textfield until the user clicks on the canvas
    if (currAction === "text" && !objectPlaced) {
      updateTempTextField(position);
    }
    // if we are trying to connect notes, keep drawing line from
    // first note to mouse until user clicks on a second note
    if (currAction === "connectNote" && !objectPlaced) {
      createLine(position);
    }

    // get user
    var user = users[hash];

    // update the position of this user as the client move around canvas
    // emit to all other clients
    if (position.x > 0 && position.x < canvas.width && position.y > 0 && position.y < canvas.height) {
      if (user) {
        //user.x = user.prevX;
        //user.y = user.prevY;
        user.prevX = user.destX;
        user.prevY = user.destY;
        user.destX = position.x;
        user.destY = position.y;
        user.lastUpdate = new Date().getTime();
        user.alpha = 0.3;
        socket.emit('movementUpdate', user);
      }
    }
  }
};

// Resizes the canvas
var resizeCanvas = function resizeCanvas(e) {
  canvas.width = Math.floor(window.innerWidth);
  canvas.height = Math.floor(window.innerHeight);

  redraw();
};
"use strict";

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

// Determines what color the text is
var textColor = void 0;

// USE THIS
var movingTextField = void 0;

// Holds each note
var notes = {};

// Object for drawing the grey note
var greynote = {};

// Flag for thread/note canvas - 0 for thread, 1 for note
var canvasBool = void 0;

// what room we are in
var currRoom = void 0;

// keeps track on what we are trying to do
var currAction = "";

//character list
var users = {};

//user's unique character id (from the server)
var hash = void 0;

var objectPlaced = false;

// curr note created
var currNote = {};

// holds text while updating element
var tempTextHolder = void 0;

//our next animation frame function
var animationFrame = void 0;

var connectFunction = function connectFunction() {
  username = document.querySelector('#username').value;

  // listening for key press, to stop curr action
  window.addEventListener("keydown", keypress, false);
  // If the username is over 15 characters, display a popup
  if (username.length > 15) {
    var popup = document.getElementById('namePopup');
    popup.innerHTML = "Usernames must not be longer than 15 characters!";
    popup.classList.toggle("show");
  } else if (username.length < 1) {
    var _popup = document.getElementById('namePopup');
    _popup.innerHTML = "Usernames must be at least 1 character!";
    _popup.classList.toggle("show");
  } else {
    canvasBool = 1;
    document.querySelector('.topics').style.display = "block";
    document.querySelector('.login').style.display = "none";
  }

  var sideBar = document.querySelector('.sideBar');

  sideBar.addEventListener('mousedown', mouseDownSideBar);
  sideBar.addEventListener('mouseup', mouseUpSideBar);
};

var tempLine = {};

var init = function init() {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  // NOTE: Set at 1 until threads in place
  canvasBool = 1;

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

  // initializing the moving text field, used to add text to elements
  movingTextField = document.querySelector('#tempTextField');

  // ---------------------

  /* OPTIONS FOR DIFFERENT STICKY NOTES */

  // Yellow sticky note
  var yellowSticky = document.querySelector('#stickyNote1');
  yellowSticky.addEventListener('click', function () {
    stickyColor = 'yellow';
    currAction = "note";
    yellowSticky.style.border = "2px solid #454545";
    greenSticky.style.border = "none";
    blueSticky.style.border = "none";
    var fakeTextField = document.querySelector("#fakeTextField");
    fakeTextField.style.zIndex = "0";
    fakeTextField.style.left = "0";
    fakeTextField.style.top = "0";
    createTempNote();
  });

  // Green sticky note
  var greenSticky = document.querySelector('#stickyNote2');
  greenSticky.addEventListener('click', function () {
    stickyColor = 'greenyellow';
    currAction = "note";
    yellowSticky.style.border = "none";
    greenSticky.style.border = "2px solid #454545";
    blueSticky.style.border = "none";
    var fakeTextField = document.querySelector("#fakeTextField");
    fakeTextField.style.zIndex = "0";
    fakeTextField.style.left = "0";
    fakeTextField.style.top = "0";
    createTempNote();
  });

  // Blue sticky note
  var blueSticky = document.querySelector('#stickyNote3');
  blueSticky.addEventListener('click', function () {
    stickyColor = 'deepskyblue';
    currAction = "note";
    yellowSticky.style.border = "none";
    greenSticky.style.border = "none";
    blueSticky.style.border = "2px solid #454545";
    var fakeTextField = document.querySelector("#fakeTextField");
    fakeTextField.style.zIndex = "0";
    fakeTextField.style.left = "0";
    fakeTextField.style.top = "0";
    createTempNote();
  });

  textColor = "#4ECDC4";

  // ---------------------

  /* OPTIONS FOR DIFFERENT TEXT COLORS */

  var textColor1 = document.querySelector('#textColor1');
  textColor1.style.border = "2px solid #454545";
  textColor1.addEventListener('click', function () {
    textColor = "#4ECDC4";
    textColor1.style.border = "2px solid #454545";
    textColor2.style.border = "none";
    textColor3.style.border = "none";
    textColor4.style.border = "none";
    textColor5.style.border = "none";
    textColor6.style.border = "none";
    textColor7.style.border = "none";
    textColor8.style.border = "none";
    textColor9.style.border = "none";
  });

  var textColor2 = document.querySelector('#textColor2');
  textColor2.addEventListener('click', function () {
    textColor = "#FF6B6B";
    textColor1.style.border = "none";
    textColor2.style.border = "2px solid #454545";
    textColor3.style.border = "none";
    textColor4.style.border = "none";
    textColor5.style.border = "none";
    textColor6.style.border = "none";
    textColor7.style.border = "none";
    textColor8.style.border = "none";
    textColor9.style.border = "none";
  });

  var textColor3 = document.querySelector('#textColor3');
  textColor3.addEventListener('click', function () {
    textColor = "#f2f2f2";
    textColor1.style.border = "none";
    textColor2.style.border = "none";
    textColor3.style.border = "2px solid #454545";
    textColor4.style.border = "none";
    textColor5.style.border = "none";
    textColor6.style.border = "none";
    textColor7.style.border = "none";
    textColor8.style.border = "none";
    textColor9.style.border = "none";
  });

  var textColor4 = document.querySelector('#textColor4');
  textColor4.addEventListener('click', function () {
    textColor = "#313638";
    textColor1.style.border = "none";
    textColor2.style.border = "none";
    textColor3.style.border = "none";
    textColor4.style.border = "2px solid #454545";
    textColor5.style.border = "none";
    textColor6.style.border = "none";
    textColor7.style.border = "none";
    textColor8.style.border = "none";
    textColor9.style.border = "none";
  });

  var textColor5 = document.querySelector('#textColor5');
  textColor5.addEventListener('click', function () {
    textColor = "#FFCC66";
    textColor1.style.border = "none";
    textColor2.style.border = "none";
    textColor3.style.border = "none";
    textColor4.style.border = "none";
    textColor5.style.border = "2px solid #454545";
    textColor6.style.border = "none";
    textColor7.style.border = "none";
    textColor8.style.border = "none";
    textColor9.style.border = "none";
  });

  var textColor6 = document.querySelector('#textColor6');
  textColor6.addEventListener('click', function () {
    textColor = "#FFE66D";
    textColor1.style.border = "none";
    textColor2.style.border = "none";
    textColor3.style.border = "none";
    textColor4.style.border = "none";
    textColor5.style.border = "none";
    textColor6.style.border = "2px solid #454545";
    textColor7.style.border = "none";
    textColor8.style.border = "none";
    textColor9.style.border = "none";
  });

  var textColor7 = document.querySelector('#textColor7');
  textColor7.addEventListener('click', function () {
    textColor = "#AA80FF";
    textColor1.style.border = "none";
    textColor2.style.border = "none";
    textColor3.style.border = "none";
    textColor4.style.border = "none";
    textColor5.style.border = "none";
    textColor6.style.border = "none";
    textColor7.style.border = "2px solid #454545";
    textColor8.style.border = "none";
    textColor9.style.border = "none";
  });

  var textColor8 = document.querySelector('#textColor8');
  textColor8.addEventListener('click', function () {
    textColor = "#800000";
    textColor1.style.border = "none";
    textColor2.style.border = "none";
    textColor3.style.border = "none";
    textColor4.style.border = "none";
    textColor5.style.border = "none";
    textColor6.style.border = "none";
    textColor7.style.border = "none";
    textColor8.style.border = "2px solid #454545";
    textColor9.style.border = "none";
  });

  var textColor9 = document.querySelector('#textColor9');
  textColor9.addEventListener('click', function () {
    textColor = "#ADEBAD";
    textColor1.style.border = "none";
    textColor2.style.border = "none";
    textColor3.style.border = "none";
    textColor4.style.border = "none";
    textColor5.style.border = "none";
    textColor6.style.border = "none";
    textColor7.style.border = "none";
    textColor8.style.border = "none";
    textColor9.style.border = "2px solid #454545";
  });

  var addTextField = document.querySelector('#textField');
  addTextField.addEventListener('click', function () {
    currAction = "text";
    createTempText();
  });

  var addConnections = document.querySelector('#makeConnection');
  addConnections.addEventListener('click', function () {
    currAction = "connect";
    var fakeTextField = document.querySelector("#fakeTextField");
    fakeTextField.style.zIndex = "0";
    fakeTextField.style.left = "0";
    fakeTextField.style.top = "0";
  });

  // when connecting, display canvas and hide the log in objecs
  // Can now click or press enter to connect
  connect.addEventListener('click', connectFunction);
  document.querySelector("#inputUser").addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
      connectFunction();
    }
  });

  // ---------------------

  /* ADD COMMENT TO NOTE */

  $("#submitNote").click(function () {
    // get the value from textarea
    var text = document.querySelector('#comment').value;
    // set curr element text to this value
    currNote.text = text;
    // clear out the textarea
    document.querySelector('#comment').value = "";
    // and hide the div
    movingTextField.style.display = "none";

    // if we are adding a note, tell server to create a note
    if (currAction === "note") {
      socket.emit('addNote', currNote);

      // if we are adding a textField, tell server to create a textField
    } else if (currAction === "text") {
      socket.emit('addTextField', currNote);

      // if we are updating a element, tell server to update this element
    } else if (currAction === "updateNote") {
      socket.emit('updateNoteText', currNote);
    }
    endAction();
  });

  // ---------------------

  /* DELETE NOTE */

  $("#deleteNote").click(function () {
    socket.emit('removeNote', currNote);

    currAction = "";
    currNote = {};
    document.querySelector('#comment').value = "";
    movingTextField.style.display = "none";
  });

  // ---------------------

  /* WILL CONNECT T0 A TOPIC AND LOAD CORRECT ROOM + OBJECTS */

  $("#topic1").click(function () {
    $(".topics").hide('slow', 'swing', function () {
      $(".can").show('slow', 'swing', function () {
        connectSocket();
        currRoom = 'room1';
        socket.emit('enterRoom', { room: 'room1' });
      });
    });
  });

  $("#topic2").click(function () {
    $(".topics").hide('slow', 'swing', function () {
      $(".can").show('slow', 'swing', function () {
        // then first send name of topic to server of course
        connectSocket();
        currRoom = 'room2';
        socket.emit('enterRoom', { room: 'room2' });
      });
    });
  });

  $("#topic3").click(function () {
    $(".topics").hide('slow', 'swing', function () {
      $(".can").show('slow', 'swing', function () {
        // then first send name of topic to server of course
        connectSocket();
        currRoom = 'room3';
        socket.emit('enterRoom', { room: 'room3' });
      });
    });
  });

  // ---------------------

  /* WILL TOGGLE THE SIDE BAR  */

  $('#close').click(function () {
    $('.sideBar').animate({ width: "0px" }, 500, function () {
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
"use strict";

// Ensures all notes besides the active note are not in focus
var changeFocus = function changeFocus(data) {
  // we have already clicked on the line button
  // and have now clicked on a note
  if (currAction === "connect") {
    // we are now trying to connec elements
    currAction = "connectNote";
    // get center position of the note we clicked
    tempLine.fromX = data.x;
    tempLine.fromY = data.y;
    // and the hash of the note
    tempLine.fromHash = data.hash;

    //if we have already clicked on one note, and is clicking on another
    // which is not the same as the first note
  }if (currAction === "connectNote" && data.hash !== tempLine.fromHash) {
    // we are now connecting 2 notes
    currAction = "connectNotes";
    // get center of the second note
    tempLine.toX = data.x;
    tempLine.toY = data.y;
    tempLine.room = currRoom;
    // get the hash of the second note
    tempLine.toHash = data.hash;
    connectTwoNotes();

    // if we are not trying to place anything
  }if (currAction === "") {
    // then we are updating a object
    currAction = "updateNote";
    updateNoteText(data);
  }
  // all other objects, put out of focus
  var keys = Object.keys(notes);
  if (keys.length > 0) {
    for (var i = 0; i < keys.length; i++) {
      var note = notes[keys[i]];

      if (note.hash != data.hash) {
        note.focus = false;
      }
    }
  }
};

// tell server to create a line between notes
var connectTwoNotes = function connectTwoNotes() {
  socket.emit('addLine', tempLine);
};

// updating a object
var updateNoteText = function updateNoteText(focusnote) {
  // make a temp template of the object
  currNote = focusnote;
  // display the textfield
  movingTextField.style.display = "block";
  movingTextField.style.left = "0px";
  movingTextField.style.top = "0px";
  movingTextField.style.left = focusnote.textPosX + "px";
  movingTextField.style.top = focusnote.textPosY + "px";
  // set value of textarea to the existing value
  document.querySelector('#comment').value = focusnote.text;
  // temp store it in case this is a textfield
  tempTextHolder = focusnote.text;
  // empty the text in the note
  focusnote.text = "";
  // display deletion button
  document.querySelector("#deleteNote").style.display = "block";
};

// Add all of the notes in the current room (from server) to the notes list
var addAllNotes = function addAllNotes(data) {
  setUser(data);
  notes = data.note;
};

// Add, or update the note in the list
var updateNoteList = function updateNoteList(data) {
  var note = data;
  note.focus = true;
  notes[note.hash] = note;
};

//when we receive a character update
var update = function update(data) {
  // add if we do not have that character (based on their id)
  if (!users[data.hash]) {
    users[data.hash] = data;
    return;
  }

  //if we received an old message, just drop it
  if (users[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  // if the data is this user, don't bother
  if (data.hash === hash) {
    return;
  }

  //grab the character based on the character id we received
  var user = users[data.hash];
  //update their direction and movement information
  //but NOT their x/y since we are animating those
  user.prevX = data.prevX;
  user.prevY = data.prevY;
  user.destX = data.destX;
  user.destY = data.destY;
  user.alpha = 0.1;
};

//function to set this user's character
var setUser = function setUser(data) {
  hash = data.user.hash; //set this user's hash to the unique one they received
  users[hash] = data.user; //set the character by their hash

  // get name from when user connected
  var name = document.querySelector("#username").value;
  users[hash].name = name;
  // tell server
  socket.emit('join', { name: name, hash: hash });
  requestAnimationFrame(redraw); //start animating
};

//function to remove a character from our character list
var removeUser = function removeUser(data) {
  //if we have that character, remove them
  if (users[data.hash]) {
    delete users[data.hash];
  }
};

var removeNote = function removeNote(data) {
  //remove note, prompted from server
  if (notes[data]) {
    delete notes[data];

    var keys = Object.keys(notes);

    // check if any lines are connected to this note, if so, delete that line too
    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        var note = notes[keys[i]];
        if (note.objectType === "line") {
          if (note.noteParentFrom === data || note.noteParentTo === data) {
            socket.emit('removeLine', note);
            delete notes[note.hash];
          }
        }
      }
    }
  }
};

// When the user connects, set up socket pipelines
var connectSocket = function connectSocket(e) {
  socket = io.connect();

  //when players move
  socket.on('updatedMovement', update);
  //when a user leaves
  socket.on('left', removeUser);

  socket.on('removeNote', removeNote);

  socket.on('addedNote', updateNoteList);

  socket.on('joined', addAllNotes);

  socket.on('objectClickDown', clickDown);

  socket.on('objectClickUp', clickUp);
};

// when we get a click down event from the server (another user clicked element)
var clickDown = function clickDown(id) {
  $("#" + id).fadeToggle("fast");
};

// when we get a click up event from the server (another user clicked element)
var clickUp = function clickUp(id) {
  $("#" + id).fadeToggle("fast");
};

// Updates the greynote's position for drawing to the canvas
var updateGrayNote = function updateGrayNote(position) {
  greynote.x = position.x;
  greynote.y = position.y;
};

// creates a temp note to follow mouse when user is about to add a stickynote
var createTempNote = function createTempNote() {
  greynote.x = 0;
  greynote.y = 0;
  greynote.radiusx = 50;
  greynote.radiusy = 50;
  greynote.width = 100;
  greynote.height = 100;
};

// updates a fake textareafield to follow mouse
var updateTempTextField = function updateTempTextField(position) {
  // KEEP THAT DARN TEMPTEXTFIELD IN THE CANVAS
  position.x -= 50;
  position.y -= 50;
  if (position.x <= 0) {
    document.querySelector("#fakeTextField").style.left = (position.x = 0) + "px";
  } else if (position.x >= canvas.width - 150) {
    document.querySelector("#fakeTextField").style.left = (position.x = canvas.width - 150) + "px";
  } else {
    document.querySelector("#fakeTextField").style.left = position.x + "px";
  }
  if (position.y <= 0) {
    document.querySelector("#fakeTextField").style.top = (position.y = 0) + "px";
  } else if (position.y >= canvas.height - 100) {
    document.querySelector("#fakeTextField").style.top = (position.y = canvas.height - 100) + "px";
  } else {
    document.querySelector("#fakeTextField").style.top = position.y + "px";
  }
};

// displays a fake textareafield to follow mouse
var createTempText = function createTempText() {
  document.querySelector("#fakeTextField").style.zIndex = "1";
};

// when user have clicked on first note, this updates end pos of line to follow mouse
var createLine = function createLine(position) {
  tempLine.toX = position.x;
  tempLine.toY = position.y;
};

// Create a note object and add it to the notes list
var addNote = function addNote(position, notePosX, notePosY) {
  currNote = {};
  currNote.color = stickyColor;
  currNote.textPosX = notePosX;
  currNote.textPosY = notePosY;
  currNote.position = position;
  currNote.username = username;
  currNote.room = currRoom;
  currNote.textColor = textColor;
};

// Create a note object and add it to the notes list
var addTextField = function addTextField(position, notePosX, notePosY) {
  currNote = {};
  currNote.textColor = textColor;
  currNote.position = position;
  currNote.textPosX = notePosX;
  currNote.textPosY = notePosY;
  currNote.username = username;
  currNote.room = currRoom;
};
