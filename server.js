var express = require('express')
  , server = express()
  , path = require('path')
  , io = require('socket.io').listen(4000);

server.use(express.static(path.join(__dirname, 'public')));
server.listen(3000);

io.sockets.on('connection', function(socket) {
  socket.on('drawClick', function(data) {
    socket.broadcast.emit('draw', {
      prevX: data.prevX,
      prevY: data.prevY,
      currX: data.currX,
      currY: data.currY,
      strokeStyle: data.strokeStyle,
      lineWidth: data.lineWidth
    });
  });

  socket.on('clearCanvas', function() {
    socket.broadcast.emit('clear', {});
  });
  socket.on('saveCanvas', function() {
    socket.broadcast.emit('save', {});
  });
});
