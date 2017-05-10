"use strict";

// Redraw to the canvas
var redraw = function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Background image
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (currAction === "note") {
    ctx.save();
    ctx.globalAlpha = 0.9;
    //ctx.shadowBlur = 5;
    //ctx.shadowOffsetX = 2;
    //ctx.shadowOffsetY = 2;
    //ctx.shadowColor = "black";
    ctx.fillStyle = stickyColor;
    ctx.fillRect(greynote.x - greynote.radiusx, greynote.y - greynote.radiusy, greynote.width, greynote.height);
    ctx.fill();
    ctx.restore();
  }
  var keys = Object.keys(notes);

  // Draw each note to the screen
  if (keys.length > 0) {
    for (var i = 0; i < keys.length; i++) {
      ctx.save();
      var note = notes[keys[i]];

      if (note.objectType === "note") {
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
        ctx.fillStyle = "black";
        wrapText(note.text, note.x + 2, note.y - 25, 85, 18);

        ctx.font = "12px Arial";
        ctx.fillStyle = "gray";
        ctx.textAlign = "right";
        ctx.fillText(note.username, note.x + note.radiusx - 2, note.y + note.radiusy - 2);
      }
      if (note.objectType === "textField") {
        ctx.save();
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = note.color;
        wrapText(note.text, note.x, note.y, 85, 18);
        ctx.restore();
      }
    }
  }

  // draws all the users
  var userKey = Object.keys(users);
  for (var _i = 0; _i < userKey.length; _i++) {
    var user = users[userKey[_i]];

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
  if (currAction === "") {

    // Get mouse positions
    var mousex = position.x;
    var mousey = position.y;

    var keys = void 0;

    if (type === 1) {
      keys = Object.keys(notes);
    } else {}
    // TODO - FILL IN FOR THREADS


    // Check if user clicked on an interactable space
    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        var rec = void 0;

        if (type === 1) {
          rec = notes[keys[i]];
        } else {
          // TODO - FILL IN FOR THREADS
        }

        if (mousex > rec.x - rec.radiusx && mousex < rec.x + rec.radiusx && mousey > rec.y - rec.radiusy && mousey < rec.y + rec.radiusy) {
          rec.focus = true;
          return rec;
        } else {
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

// if you press Q, then it will stop the action
var keypress = function keypress(e) {
  if (e.keyCode === 81) {
    currAction = "";
    movingTextField.style.display = "none";
    document.querySelector(".btn-group").style.display = "none";
  }
};

//handler for key up events
var mouseUpHandler = function mouseUpHandler(e) {
  // Determines where the user clicked
  var position = getMousePos(e, canvas);
  var posX = position.x - 50;
  var posY = position.y - 60;
  console.log(currAction);

  if (canvasBool === 1) {
    //let text = textField.value;
    //textField.value = "";
    if (checkClickOnRec(position, 1)) {
      changeFocus(checkClickOnRec(position, 1));
      // Focuses on the note the user clicked on
    } else if (currAction === "note") {
      // adds a note 
      addNote(position, posX, posY);
      objectPlaced = true;
      movingTextField.style.display = 'block';
      movingTextField.style.left = posX + 'px';
      movingTextField.style.top = posY + 'px';
    } else if (currAction === "text") {
      console.log(currAction);
      // adds a text field
      document.querySelector("#fakeTextField").style.display = "none";
      addTextField(position, posX, posY);
      objectPlaced = true;
      console.log("objectPlaced: " + objectPlaced);
      movingTextField.style.display = 'block';
      movingTextField.style.left = posX + 'px';
      movingTextField.style.top = posY + 'px';
      document.querySelector(".btn-group").style.display = "block";
      document.querySelector(".btn-group").style.left = posX + 150 + "px";
      document.querySelector(".btn-group").style.top = posY - 50 + "px";
    }
  }
};

// function from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
var wrapText = function wrapText(text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
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
  if (position) {
    //if (currAction === "note" && !objectPlaced) {
    updateGrayNote(position);
    //}
    if (currAction === "text" && !objectPlaced) {
      updateTempTextField(position);
    }

    var user = users[hash];

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

// to limit topics
var numTopics = 0;

// Determines which color the sticky note is
var stickyColor = void 0;

// Used to get the value of text
var textField = void 0;

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

var currAction = "";

var objectPlaced = false;

//character list
var users = {};
//user's unique character id (from the server)
var hash = void 0;

// curr note created
var currNote = {};

//our next animation frame function
var animationFrame = void 0;

var strokeColor = "black";

var connectFunction = function connectFunction() {
  username = document.querySelector('#username').value;

  createTempNote();

  // listening for key press, to stop curr action
  window.addEventListener("keydown", keypress, false);
  // If the username is over 15 characters, display a popup
  if (username.length > 15) {
    var popup = document.getElementById('namePopup');
    popup.classList.toggle("show");
  } else {
    console.log('connect');
    canvasBool = 1;
    document.querySelector('.topics').style.display = "block";
    document.querySelector('.login').style.display = "none";
  }
};

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

  movingTextField = document.querySelector('#tempTextField');

  // Yellow sticky note
  var yellowSticky = document.querySelector('#stickyNote1');
  yellowSticky.addEventListener('click', function () {
    stickyColor = 'yellow';
    currAction = "note";
    yellowSticky.style.border = "2px solid #454545";
    greenSticky.style.border = "none";
    blueSticky.style.border = "none";
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
    createTempNote();
  });

  var addTextField = document.querySelector('#textField');
  addTextField.addEventListener('click', function () {
    currAction = "text";
    createTempText();
  });

  // when connecting, display canvas and hide the log in objecs
  // Can now click or press enter to connect
  connect.addEventListener('click', connectFunction);
  document.querySelector("#inputUser").addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
      console.log("here");
      connectFunction();
    }
  });

  // ---------------------

  /* ADDING TOPICS */

  $("#topicBtn").click(function () {
    numTopics++;

    if ($(".clearfix1").is(":hidden")) {
      $(".clearfix1").show();
    } else if ($(".clearfix2").is(":hidden")) {
      $(".clearfix2").show();
    } else if ($(".clearfix3").is(":hidden")) {
      $(".clearfix3").show();
    }

    if (numTopics === 3) {
      $('#topicBtn').hide();
    }
  });

  // ---------------------

  /* ADD COMMENT TO NOTE */

  $("#submitNote").click(function () {
    var text = document.querySelector('#comment').value;
    currNote.text = text;
    document.querySelector('#comment').value = "";
    movingTextField.style.display = "none";
    if (currAction === "note") {
      console.log('adding note');
      socket.emit('addNote', currNote);
    } else if (currAction === "text") {
      console.log('adding text');
      socket.emit('addTextField', currNote);
    } else if (currAction === "updateNote") {
      socket.emit('updateNoteText', currNote);
    }
    currAction = "";
    currNote = {};
    objectPlaced = false;
    document.querySelector(".btn-group").style.display = "none";
  });

  // ---------------------

  /* DELETE NOTE */

  $("#deleteNote").click(function () {
    socket.emit('removeNote', currNote);
    currAction = "";
    currNote = {};document.querySelector('#comment').value = "";
    movingTextField.style.display = "none";
  });

  // ---------------------

  /* WILL TOGGLE EDITING FOR TOPICS */

  $("#showSettings1").click(function () {
    $(".settings1").toggle('fast', 'swing');
  });

  $("#showSettings2").click(function () {
    $(".settings2").toggle('fast', 'swing');
  });

  $("#showSettings3").click(function () {
    $(".settings3").toggle('fast', 'swing');
  });

  // ---------------------

  /* WILL GET THE NEW NAME FOR TOPIC */

  $("#submitTopic1").click(function () {
    var text = $("#name1").val();
    $(".settings1").toggle('fast', 'swing');

    $("#topicsName1").html(text);
  });

  $("#submitTopic2").click(function () {
    var text = $("#name2").val();
    $(".settings2").toggle('fast', 'swing');

    $("#topicsName2").html(text);
  });

  $("#submitTopic3").click(function () {
    var text = $("#name3").val();
    $(".settings3").toggle('fast', 'swing');

    $("#topicsName3").html(text);
  });

  // ---------------------

  /* WILL DELETE TOPIC */

  $("#delete1").click(function () {
    $("#name1").val('');

    $("#topicsName1").html('1');
    numTopics--;
    $(".clearfix1").hide();
    $(".settings1").hide();
    $('#topicBtn').show();
  });

  $("#delete2").click(function () {
    $("#name2").val('');

    $("#topicsName2").html('2');
    numTopics--;
    $(".clearfix2").hide();
    $(".settings2").hide();
    $('#topicBtn').show();
  });

  $("#delete3").click(function () {
    $("#name3").val('');

    $("#topicsName3").html('3');
    numTopics--;
    $(".clearfix3").hide();
    $(".settings3").hide();
    $('#topicBtn').show();
  });

  // ---------------------

  /* WILL CONNECT T0 A TOPIC */

  $("#topic1").click(function () {
    $(".topics").hide('slow', 'swing', function () {
      $(".can").show('slow', 'swing', function () {
        // then first send name of topic to server of course
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
        // createGrayNote();
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
        //createGrayNote();
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
  currAction = "updateNote";
  updateNoteText(data);
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

var updateNoteText = function updateNoteText(focusnote) {
  currNote = focusnote;
  movingTextField.style.display = "block";
  movingTextField.style.left = currNote.textPosX + "px";
  movingTextField.style.top = currNote.textPosY + "px";
  document.querySelector('#comment').value = focusnote.text;
  //document.querySelector('#comment').style.resize = "none";
  focusnote.text = "";
  document.querySelector("#deleteNote").style.display = "block";
};
// Add all of the notes in the current room to the notes list
var addAllNotes = function addAllNotes(data) {
  setUser(data);
  console.dir(data.note);
  notes = data.note;
};

// Add the note to the list if it doesn't exist
var updateNoteList = function updateNoteList(data) {
  console.dir(data);
  var note = data;
  note.focus = true;
  if (!notes[data.hash]) {
    console.log('dont exist');
    notes[data.hash] = note;
    return;
  } else if (notes[data.hash]) {
    console.log('exist');
    notes[data.hash] = data;
  }
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
  //if we have that character, remove them
  if (notes[data]) {
    delete notes[data];
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
};

// Updates the greynote's position for drawing to the canvas
var updateGrayNote = function updateGrayNote(position) {
  greynote.x = position.x;
  greynote.y = position.y;
};

var updateTempTextField = function updateTempTextField(position) {
  document.querySelector("#fakeTextField").style.left = position.x - 50 + "px";
  document.querySelector("#fakeTextField").style.top = position.y - 50 + "px";
};

// Adds the grey note object to the notes list for drawing
//const createGrayNote = () => {
//  greynote.x = 0;
//  greynote.y = 0;
//  greynote.radiusx = 50;
//  greynote.radiusy = 50;
//  greynote.width = 100;
//  greynote.height = 100;
//};

var createTempNote = function createTempNote() {
  greynote.x = 0;
  greynote.y = 0;
  greynote.radiusx = 50;
  greynote.radiusy = 50;
  greynote.width = 100;
  greynote.height = 100;
};

var createTempText = function createTempText() {
  document.querySelector("#fakeTextField").style.display = "block";
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
};

// Create a note object and add it to the notes list
var addTextField = function addTextField(position, notePosX, notePosY) {
  currNote = {};
  currNote.color = "red";
  currNote.position = position;
  currNote.username = username;
  currNote.room = currRoom;
};
