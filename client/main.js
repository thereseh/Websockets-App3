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

// to limit topics
//let numTopics = 0;

// Determines which color the sticky note is
let stickyColor;

// Used to get the value of text
let textField;

// Holds each note
let notes = {};

// Object for drawing the grey note
let greynote = {};

// Flag for thread/note canvas - 0 for thread, 1 for note
let canvasBool;

// what room we are in
let currRoom;


let currAction = "";

let objectPlaced = false;

//character list
let users = {}; 
//user's unique character id (from the server)
let hash; 

// curr note created
let currNote = {};

//our next animation frame function
let animationFrame; 

let strokeColor = "black";


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
  
  // listening for key press, to stop curr action
  window.addEventListener("keydown", keypress, false);
 
 
  // Yellow sticky note
  const yellowSticky = document.querySelector('#stickyNote1');
  yellowSticky.addEventListener('click', function() {
    stickyColor = 'yellow';
    currAction = "note";
    createTempNote();
  });
  // Green sticky note
  const greenSticky = document.querySelector('#stickyNote2');
  greenSticky.addEventListener('click', function() {
    stickyColor = 'greenyellow';
    currAction = "note";
    createTempNote();
  });
  // Blue sticky note
  const blueSticky = document.querySelector('#stickyNote3');
  blueSticky.addEventListener('click', function() {
    stickyColor = 'deepskyblue';
    currAction = "note";
    createTempNote();
  });
  
  
  // when connecting, display canvas and hide the log in objecs
  connect.addEventListener('click', () => {
    username = document.querySelector('#username').value;

    // If the username is over 15 characters, display a popup
    if (username.length > 15) {      
      let popup = document.getElementById('namePopup');
      popup.classList.toggle("show");
    } else {
      console.log('connect');
      canvasBool = 1;
      document.querySelector('.topics').style.display = "block";
      document.querySelector('.login').style.display = "none";
    }
  });
  
  // ---------------------
  
  /* ADDING TOPICS */
  

  $("#topicBtn").click(function(){
    //numTopics++; 
      
    
      if ($(".clearfix1").is(":hidden")) {
          $(".clearfix1").show();
      }
      else if ($(".clearfix2").is(":hidden")) {
          $(".clearfix2").show();
      }
      else if ($(".clearfix3").is(":hidden")) {
        $(".clearfix3").show();
      }
    
    //if (numTopics === 3) {
    //  $('#topicBtn').hide();
    //}
  });
  
  
  // ---------------------
  
  /* ADD COMMENT TO NOTE */
   $("#submitNote").click(function(){
    let text = document.querySelector('#comment').value;
    currNote.text = text;
     
    document.querySelector('#comment').value = ""; document.querySelector('#tempTextField').style.display = "none";
     
     if (currAction === "note") {
        socket.emit('addNote', currNote);
     } else if (currAction === "text") {
       socket.emit('addTextField', currNote);
     } else if (currAction === "updateNote") {
        socket.emit('updateNoteText', currNote);
     }
     currAction = "";
     currNote = {};
     objectPlaced = false;

  });
  
  
  // ---------------------
  
  /* WILL TOGGLE EDITING FOR TOPICS */
    
  $("#showSettings1").click(function(){
    $(".settings1").toggle('fast', 'swing');
  });
  
   $("#showSettings2").click(function(){
    $(".settings2").toggle('fast', 'swing');
  });
  
   $("#showSettings3").click(function(){
    $(".settings3").toggle('fast', 'swing');
  });

  
  // ---------------------
  
  /* WILL GET THE NEW NAME FOR TOPIC */

  
   $("#submitTopic1").click(function(){
    let text = $("#name1").val();
    $(".settings1").toggle('fast', 'swing');


    $("#topicsName1").html(text);
  });
  
  $("#submitTopic2").click(function(){
    let text = $("#name2").val();
    $(".settings2").toggle('fast', 'swing');


    $("#topicsName2").html(text);
  });
  
  $("#submitTopic3").click(function(){
    let text = $("#name3").val();
    $(".settings3").toggle('fast', 'swing');


    $("#topicsName3").html(text);
  });
  
  // ---------------------
  
  /* WILL GET THE NEW NAME FOR TOPIC */

  
   $("#delete1").click(function(){
    $("#name1").val('');

    $("#topicsName1").html('1');
     numTopics--;
      $(".clearfix1").hide();
      $(".settings1").hide();
      $('#topicBtn').show();
  });
  
   $("#delete2").click(function(){
    $("#name2").val('');

    $("#topicsName2").html('2');
     numTopics--;
      $(".clearfix2").hide();
      $(".settings2").hide();
      $('#topicBtn').show();
  });
  
  $("#delete3").click(function(){
    $("#name3").val('');

    $("#topicsName3").html('3');
     numTopics--;
      $(".clearfix3").hide();
      $(".settings3").hide();
      $('#topicBtn').show();
  });
  
  $("#submitTopic2").click(function(){
    let text = $("#name2").val();

    $("#topicsName2").html(text);
  });
  
  $("#submitTopic3").click(function(){
    let text = $("#name3").val();

    $("#topicsName3").html(text);
  });
  
  // ---------------------
  
  /* WILL GET THE NEW NAME FOR TOPIC */

  
   $("#topic1").click(function(){
    $(".topics").hide('slow', 'swing', function() {
      $(".can").show('slow', 'swing', function() {
        // then first send name of topic to server of course
        let text = $("#topicsName1").val();
        console.log($("#topicsName1").val());
        connectSocket();
        currRoom = text;
        socket.emit('enterRoom', {room: text});
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
         // createGrayNote();
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
          //createGrayNote();
      });
    });
  });
  
  // ---------------------
  
    /* WILL TOGGLE THE SIDE BAR  */
  
   $('#close').click(function(){
        $('.sideBar').animate({width:"0px"}, 500, function() {
        console.log('done');
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