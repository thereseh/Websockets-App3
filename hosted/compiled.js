'use strict';

var canvas = void 0;
var ctx = void 0;

var getMousePos = function getMousePos(e, can) {
  var rect = canvas.getBoundingClientRect();

  // get more accurate position on canvas
  var position = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  return position;
};

//handler for key up events
var mouseUpHandler = function mouseUpHandler(e) {};

//handler for key up events
var mouseMoveHandler = function mouseMoveHandler(e) {};

// When the user connects, set up socket pipelines
var connectSocket = function connectSocket(e) {};

var init = function init() {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  // connect to socket
  var connect = document.querySelector("#connect");

  // mouse event handlers
  document.body.addEventListener('mouseup', mouseUpHandler);
  document.body.addEventListener('mousemove', mouseMoveHandler);

  // when connecting, display canvas and hide the log in objecs
  connect.addEventListener('click', function () {
    console.log('connect');
    document.querySelector('.can').style.display = "block";
    document.querySelector('.login').style.display = "none";
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
