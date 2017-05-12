let canvas;
let ctx;
let socket;

// Holds background image and pattern
let background;
let pattern;

// Holds username
let username;

// Holds colors for drawing sticky notes
const ColorEnum = {
  YELLOW: 1,
  GREEN: 2,
  BLUE: 3,
};

// Determines which color the sticky note is
let stickyColor;

// Determines what color the text is
let textColor;

// USE THIS
let movingTextField;

// Holds each note
let notes = {};

// Object for drawing the grey note
let greynote = {};

// Flag for thread/note canvas - 0 for thread, 1 for note
let canvasBool;

// what room we are in
let currRoom;

// keeps track on what we are trying to do
let currAction = "";

//character list
let users = {}; 

//user's unique character id (from the server)
let hash; 

let objectPlaced = false;

// curr note created
let currNote = {};

// holds text while updating element
let tempTextHolder;

//our next animation frame function
let animationFrame; 

const connectFunction = () => {
    username = document.querySelector('#username').value;
  
    // listening for key press, to stop curr action
    window.addEventListener("keydown", keypress, false);
    // If the username is over 15 characters, display a popup
    if (username.length > 15) {      
      let popup = document.getElementById('namePopup');
      popup.innerHTML = "Usernames must not be longer than 15 characters!";
      popup.classList.toggle("show");
    } else if (username.length < 1) {
      let popup = document.getElementById('namePopup');
      popup.innerHTML = "Usernames must be at least 1 character!";
      popup.classList.toggle("show");
      
    } else {
      canvasBool = 1;
      document.querySelector('.topics').style.display = "block";
      document.querySelector('.login').style.display = "none";
    }
  
  let sideBar = document.querySelector('.sideBar');

  sideBar.addEventListener('mousedown', mouseDownSideBar);
  sideBar.addEventListener('mouseup', mouseUpSideBar);
  
};

let tempLine = {};

const init = () => {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  
  // NOTE: Set at 1 until threads in place
  canvasBool = 1;
  
  // Sets information to draw the background
  background = new Image();
  background.src = "http://img06.deviantart.net/49d3/i/2010/245/0/c/pinboard_texture_by_nikky81-d2xuip9.png";
  background.onload = function() {
    pattern = ctx.createPattern(background, 'repeat');
    resizeCanvas();
  };  

  // connect to socket
  const connect = document.querySelector("#connect");
  
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
  const yellowSticky = document.querySelector('#stickyNote1');
  yellowSticky.addEventListener('click', function() {
    stickyColor = 'yellow';
    currAction = "note";
    yellowSticky.style.border = "2px solid #454545";
    greenSticky.style.border = "none";
    blueSticky.style.border = "none";
    let fakeTextField = document.querySelector("#fakeTextField")
    fakeTextField.style.zIndex = "0";
    fakeTextField.style.left = "0";
    fakeTextField.style.top = "0";
    createTempNote();
  });
  
  // Green sticky note
  const greenSticky = document.querySelector('#stickyNote2');
  greenSticky.addEventListener('click', function() {
    stickyColor = 'greenyellow';
    currAction = "note";
    yellowSticky.style.border = "none";
    greenSticky.style.border = "2px solid #454545";
    blueSticky.style.border = "none";
    let fakeTextField = document.querySelector("#fakeTextField")
    fakeTextField.style.zIndex = "0";
    fakeTextField.style.left = "0";
    fakeTextField.style.top = "0";
    createTempNote();
  });
  
  // Blue sticky note
  const blueSticky = document.querySelector('#stickyNote3');
  blueSticky.addEventListener('click', function() {
    stickyColor = 'deepskyblue';
    currAction = "note";
    yellowSticky.style.border = "none";
    greenSticky.style.border = "none";
    blueSticky.style.border = "2px solid #454545";
    let fakeTextField = document.querySelector("#fakeTextField")
    fakeTextField.style.zIndex = "0";
    fakeTextField.style.left = "0";
    fakeTextField.style.top = "0";
    createTempNote();
  });
  
  textColor = "#4ECDC4"
  
   // ---------------------
  
  /* OPTIONS FOR DIFFERENT TEXT COLORS */
  
  const textColor1 = document.querySelector('#textColor1');
  textColor1.style.border = "2px solid #454545";
  textColor1.addEventListener('click', function() {
    textColor = "#4ECDC4"
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
  
  const textColor2 = document.querySelector('#textColor2');
  textColor2.addEventListener('click', function() {
    textColor = "#FF6B6B"
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
  
  const textColor3 = document.querySelector('#textColor3');
  textColor3.addEventListener('click', function() {
    textColor = "#f2f2f2"
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
  
  const textColor4 = document.querySelector('#textColor4');
  textColor4.addEventListener('click', function() {
    textColor = "#313638"
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
  
  const textColor5 = document.querySelector('#textColor5');
  textColor5.addEventListener('click', function() {
    textColor = "#FFCC66"
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
  
  const textColor6 = document.querySelector('#textColor6');
  textColor6.addEventListener('click', function() {
    textColor = "#FFE66D"
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
  
  const textColor7 = document.querySelector('#textColor7');
  textColor7.addEventListener('click', function() {
    textColor = "#AA80FF"
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
  
  const textColor8 = document.querySelector('#textColor8');
  textColor8.addEventListener('click', function() {
    textColor = "#800000"
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
  
  const textColor9 = document.querySelector('#textColor9');
  textColor9.addEventListener('click', function() {
    textColor = "#ADEBAD"
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
  
  const addTextField = document.querySelector('#textField');
  addTextField.addEventListener('click', function() {
    currAction = "text";
    createTempText();
  });
  
  const addConnections = document.querySelector('#makeConnection');
  addConnections.addEventListener('click', function() {
    currAction = "connect";
    let fakeTextField = document.querySelector("#fakeTextField")
    fakeTextField.style.zIndex = "0";
    fakeTextField.style.left = "0";
    fakeTextField.style.top = "0";
  });
  
  
  // when connecting, display canvas and hide the log in objecs
  // Can now click or press enter to connect
  connect.addEventListener('click', connectFunction);
  document.querySelector("#inputUser").addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      connectFunction();
    }
  });
  
  
  // ---------------------
  
  /* ADD COMMENT TO NOTE */
  
  $("#submitNote").click(function(){
    // get the value from textarea
    let text = document.querySelector('#comment').value;
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
  
  $("#deleteNote").click(function(){
    socket.emit('removeNote', currNote);
  
    currAction = "";
    currNote = {};  
    document.querySelector('#comment').value = ""; 
    movingTextField.style.display = "none";
  });
  
  // ---------------------
  
  /* WILL CONNECT T0 A TOPIC AND LOAD CORRECT ROOM + OBJECTS */

  $("#topic1").click(function(){
    $(".topics").hide('slow', 'swing', function() {
      $(".can").show('slow', 'swing', function() {
        connectSocket();
        currRoom = 'room1';
        socket.emit('enterRoom', {room: 'room1'});
      });
    });
  });
  
  $("#topic2").click(function(){
    $(".topics").hide('slow', 'swing', function() {
      $(".can").show('slow', 'swing', function() {
        // then first send name of topic to server of course
        connectSocket();
        currRoom = 'room2';
        socket.emit('enterRoom', {room: 'room2'});
      });
    });
  });
  
  $("#topic3").click(function(){
    $(".topics").hide('slow', 'swing', function() {
      $(".can").show('slow', 'swing', function() {
        // then first send name of topic to server of course
        connectSocket();
        currRoom = 'room3';
        socket.emit('enterRoom', {room: 'room3'});
      });
    });
  });
  
  // ---------------------
  
  /* WILL TOGGLE THE SIDE BAR  */
  
  $('#close').click(function(){
        $('.sideBar').animate({width:"0px"}, 500, function() {
       $('#toggle').hide();
       $('#open').show();
       $('#close').hide();
      });
   });
  
  $('#open').click(function(){
        $('.sideBar').animate({width:"200px"}, 500, function() {
       $('#toggle').show();
       $('#close').show();
       $('#open').hide();
      });
   });
};

window.onload = init;