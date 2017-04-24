let canvas;
let ctx;

// Holds colors for drawing sticky notes
const ColorEnum = {
  YELLOW: 1,
  GREEN: 2,
  BLUE: 3,
};

// Determines which color the sticky note is
let stickyColor;

const getMousePos = (e, can) => {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
          
  // get more accurate position on canvas
    let position = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
    return position;
};


//handler for key up events
const mouseUpHandler = (e) => {
  // Determines where to add the sticky note
  const position = getMousePos(e, canvas);
  addNote(stickyColor, position);
};

//handler for key up events
const mouseMoveHandler = (e) => {

};

// When the user connects, set up socket pipelines
const connectSocket = (e) => {

};

const init = () => {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  // connect to socket
  const connect = document.querySelector("#connect");

  // mouse event handlers - NOTE: First line is changed to just get events for the canvas
  canvas.addEventListener('mouseup', mouseUpHandler);
  document.body.addEventListener('mousemove', mouseMoveHandler);
  
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
  
  // when connecting, display canvas and hide the log in objecs
  connect.addEventListener('click', () => {
    console.log('connect');
    document.querySelector('.can').style.display = "block";
  document.querySelector('.login').style.display = "none";
  });
  
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