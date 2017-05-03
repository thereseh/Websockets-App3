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
let numTopics = 0;

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
  
  // Event handlers for sidebar
  stickyColor = ColorEnum.YELLOW;
  // Yellow sticky note
  const yellowSticky = document.querySelector('#stickyNote1');
  yellowSticky.addEventListener('click', function() {
    stickyColor = ColorEnum.YELLOW;
  });
  // Green sticky note
  const greenSticky = document.querySelector('#stickyNote2');
  greenSticky.addEventListener('click', function() {
    stickyColor = ColorEnum.GREEN;
  });
  // Blue sticky note
  const blueSticky = document.querySelector('#stickyNote3');
  blueSticky.addEventListener('click', function() {
    stickyColor = ColorEnum.BLUE;
  });
  
  // Used for getting text
  textField = document.querySelector('#textField');
  
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
  
  $("#topicBtn").click(function(){
    numTopics++; 
    
      if ($(".clearfix1").is(":hidden")) {
          $(".clearfix1").show();
      }
      else if ($(".clearfix2").is(":hidden")) {
          $(".clearfix2").show();
      }
      else if ($(".clearfix3").is(":hidden")) {
        $(".clearfix3").show();
      }
    
    if (numTopics === 3) {
      $('#topicBtn').hide();
    }
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

    $("#topicsName1").html(text);
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

    $("#topicsName2").html('3');
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
          createGrayNote();
      });
    });
  });
  
  $("#topic2").click(function(){
    $(".topics").hide('slow', 'swing', function() {
      $(".can").show('slow', 'swing', function() {
        // then first send name of topic to server of course
          createGrayNote();
      });
    });
  });
  
  $("#topic3").click(function(){
    $(".topics").hide('slow', 'swing', function() {
      $(".can").show('slow', 'swing', function() {
        // then first send name of topic to server of course
          createGrayNote();
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