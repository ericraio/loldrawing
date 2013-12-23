var canvas, ctx, socket, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;

var x = "black",
y = 2;

function init() {
  canvas = document.getElementById('can');
  ctx = canvas.getContext("2d");
  w = canvas.width;
  h = canvas.height;
  socket = io.connect('http://43.148.14.7:4000')
  strokeStyle = "black";
  lineWidth = 2;

  canvas.addEventListener("mousemove", function (event) {
    findxy('move', event)
  }, false);
  canvas.addEventListener("mousedown", function (event) {
    findxy('down', event)
  }, false);
  canvas.addEventListener("mouseup", function (event) {
    findxy('up', event)
  }, false);
  canvas.addEventListener("mouseout", function (event) {
    findxy('out', event)
  }, false);

  socket.on('draw', function(data) { draw(data); });
  socket.on('clear', function() { erase(); });
  socket.on('save', function() { save(); });
}

function color(obj) {
  if (obj.id === strokeStyle) { return };
  switch (obj.id) {
    case "green":
      strokeStyle = "green";
    break;
    case "blue":
      strokeStyle = "blue";
    break;
    case "red":
      strokeStyle = "red";
    break;
    case "yellow":
      strokeStyle = "yellow";
    break;
    case "orange":
      strokeStyle = "orange";
    break;
    case "black":
      strokeStyle = "black";
    break;
    case "white":
      strokeStyle = "white";
    break;
  }
  if (strokeStyle === "white") { lineWidth = 14; }
}

function draw(data) {
  ctx.beginPath();

  if (data) {
    ctx.moveTo(data.prevX, data.prevY);
    ctx.lineTo(data.currX, data.currY);
    ctx.strokeStyle = data.strokeStyle;
    ctx.lineWidth = data.lineWidth;
  } else {
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
  }

  ctx.stroke();
  ctx.closePath();
}

function emitErase() {
  if (confirm("Want to clear")) {
    socket.emit('clearCanvas', {});
    erase();
  }
}

function erase() {
  ctx.clearRect(0, 0, w, h);
  document.getElementById("canvasimg").style.display = "none";
}

function emitSave() {
  socket.emit("saveCanvas", {});
  save();
}

function save() {
  document.getElementById("canvasimg").style.border = "2px solid";
  var dataURL = canvas.toDataURL();
  document.getElementById("canvasimg").src = dataURL;
  document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, event) {
  if (res == 'down') {
    prevX = currX;
    prevY = currY;
    currX = event.clientX - canvas.offsetLeft;
    currY = event.clientY - canvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = x;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }
  }
  if (res === 'up' || res === "out") {
    flag = false;
  }
  if (res === 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = event.clientX - canvas.offsetLeft;
      currY = event.clientY - canvas.offsetTop;

      draw();
      socket.emit('drawClick', { 
        prevX: prevX,
        prevY: prevY,
        currX: currX,
        currY: currY,
        strokeStyle: strokeStyle,
        lineWidth: lineWidth
      });
    }
  }
}
