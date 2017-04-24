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

// Used to get the value of text
let textField;

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
  let text = textField.value;
  textField.value = "";
  
  if(text.trim().length === 0) {
    return;
  }
  // Determines where to add the sticky note
  const position = getMousePos(e, canvas);
  addNote(stickyColor, position, text.trim());
};

//handler for key up events
const mouseMoveHandler = (e) => {

};

// When the user connects, set up socket pipelines
const connectSocket = (e) => {

};

const resizeCanvas = (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const init = () => {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();

  // connect to socket
  const connect = document.querySelector("#connect");
  
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