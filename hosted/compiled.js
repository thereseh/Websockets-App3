"use strict";

// Redraw to the canvas
var redraw = function redraw() {
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

  var keys = Object.keys(notes);

  // Draw each note to the screen
  if (keys.length > 0) {
    for (var i = 0; i < keys.length; i++) {
      var note = notes[keys[i]];

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
"use strict";

// Checks to see if the user clicked within interactable spaces
var checkClickOnRec = function checkClickOnRec(position, type) {
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

//handler for key up events
var mouseUpHandler = function mouseUpHandler(e) {
  // Determines where the user clicked
  var position = getMousePos(e, canvas);

  if (canvasBool === 1) {
    var text = textField.value;
    textField.value = "";

    if (checkClickOnRec(position, 1)) {
      changeFocus(checkClickOnRec(position, 1)); // Focuses on the note the user clicked on
    } else {
      if (text.trim().length === 0) {
        return;
      }
      addNote(stickyColor, position, text.trim()); // Adds a note if no note was clicked on
    }
  } else {// TODO - Add handler support on thread canvas
    };
};

//handler for key up events
var mouseMoveHandler = function mouseMoveHandler(e) {
  var position = getMousePos(e, canvas);
  if (position) {
    updateGrayNote(position);
  }
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

// to limit topics
var numTopics = 0;

// Determines which color the sticky note is
var stickyColor = void 0;

// Used to get the value of text
var textField = void 0;

// Holds each note
var notes = {};

// Object for drawing the grey note
var greynote = {};

// Flag for thread/note canvas - 0 for thread, 1 for note
var canvasBool = void 0;

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

    // If the username is over 15 characters, display a popup
    if (username.length > 15) {
      var popup = document.getElementById('namePopup');
      popup.classList.toggle("show");
    } else {
      console.log('connect');
      canvasBool = 1;
      //$(".clearfix1").hide();
      //$(".clearfix2").hide();
      //$(".clearfix3").hide();
      document.querySelector('.topics').style.display = "block";
      document.querySelector('.login').style.display = "none";
      connectSocket();
    }
  });

  // ---------------------

  /* ADDING TOPICS */

  // when adding a topic, removes button after 3 are added
  //addTopic.addEventListener('click', () => {
  //  numTopics++; 
  //  document.querySelector(`#t${numTopics}`).style.display = "inline-block";
  //  
  //   if (numTopics === 3) {
  //    //$('#topicBtn').addClass('disabled');
  //    $('#topicBtn').hide();
  //  }
  //});

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

    $("#topicsName1").html(text);
  });

  $("#submitTopic2").click(function () {
    var text = $("#name2").val();

    $("#topicsName2").html(text);
  });

  $("#submitTopic3").click(function () {
    var text = $("#name3").val();

    $("#topicsName3").html(text);
  });

  // ---------------------

  /* WILL GET THE NEW NAME FOR TOPIC */

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

    $("#topicsName2").html('3');
    numTopics--;
    $(".clearfix3").hide();
    $(".settings3").hide();
    $('#topicBtn').show();
  });

  $("#submitTopic2").click(function () {
    var text = $("#name2").val();

    $("#topicsName2").html(text);
  });

  $("#submitTopic3").click(function () {
    var text = $("#name3").val();

    $("#topicsName3").html(text);
  });

  // ---------------------

  /* WILL GET THE NEW NAME FOR TOPIC */

  $("#topic1").click(function () {
    $(".topics").hide('slow', 'swing', function () {
      $(".can").show('slow', 'swing', function () {
        // then first send name of topic to server of course
        createGrayNote();
      });
    });
  });

  $("#topic2").click(function () {
    $(".topics").hide('slow', 'swing', function () {
      $(".can").show('slow', 'swing', function () {
        // then first send name of topic to server of course
        createGrayNote();
      });
    });
  });

  $("#topic3").click(function () {
    $(".topics").hide('slow', 'swing', function () {
      $(".can").show('slow', 'swing', function () {
        // then first send name of topic to server of course
        createGrayNote();
      });
    });
  });

  // ---------------------

  /* WILL TOGGLE THE SIDE BAR  */

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

// Ensures all notes besides the active note are not in focus
var changeFocus = function changeFocus(data) {
  var keys = Object.keys(notes);

  if (keys.length > 0) {
    for (var i = 0; i < keys.length; i++) {
      var note = notes[keys[i]];

      if (note.hash !== data.hash) {
        note.focus = false;
      }
    }
  }
};

// Add all of the notes in the current room to the notes list
var addAllNotes = function addAllNotes(data) {
  notes = data;
};

// Add the note to the list if it doesn't exist
var updateNoteList = function updateNoteList(data) {
  var note = data;
  note.focus = true;
  if (!notes[data.hash]) {
    notes[data.hash] = note;
    return;
  }
};

// When the user connects, set up socket pipelines
var connectSocket = function connectSocket(e) {
  socket = io.connect();

  socket.on('addedNote', updateNoteList);
  socket.on('joined', addAllNotes);
};

// Updates the greynote's position for drawing to the canvas
var updateGrayNote = function updateGrayNote(position) {
  greynote.x = position.x;
  greynote.y = position.y;
};

// Adds the grey note object to the notes list for drawing
var createGrayNote = function createGrayNote() {
  greynote.x = 0;
  greynote.y = 0;
  greynote.radiusx = 50;
  greynote.radiusy = 50;
  greynote.width = 100;
  greynote.height = 100;
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
