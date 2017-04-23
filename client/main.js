let canvas;
let ctx;

const getMousePos = (e, can) => {
    let rect = canvas.getBoundingClientRect();
          
  // get more accurate position on canvas
    let position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    return position;
};


//handler for key up events
const mouseUpHandler = (e) => {
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

  // mouse event handlers
  document.body.addEventListener('mouseup', mouseUpHandler);
  document.body.addEventListener('mousemove', mouseMoveHandler);
  
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