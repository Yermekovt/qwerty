
//socket for chat system
var socket = io();

//when the message is submitted, it will be stored in message var and then sent to general chat. After all, the message form will be empty
$('#generalChatForm').submit(function () {

    var message = $('#generalInput').val();

    if (message) {
        socket.emit('general', message);
        $("#generalInput").val("");
    }
    return false;
})

//when the message is submitted, it will be stored in message var and then sent to film chat. After all, the message form will be empty
$('#filmChatForm').submit(function () {
 
  var message = $('#filmInput').val();

  if (message) {
      socket.emit('film', message);
      $("#filmInput").val("");
  }
  return false;
})

//when the message is submitted, it will be stored in message var and then sent to series chat. After all, the message form will be empty
$('#seriesChatForm').submit(function () {
  
  var message = $('#seriesInput').val();

  if (message) {
      socket.emit('series', message);
      $("#seriesInput").val("");
  }
  return false;
})

//when the message from general chat is received, it will be appended on client side to an element with id 'generalMessage'
socket.on('general', function(msg) {
    $('#generalMessages').append("<li>" + msg + "</li>");
    window.scrollTo(0, document.body.scrollHeight);
});

//when the message from general chat is received, it will be appended on client side to an element with id 'filmMessage'
socket.on('film', function(msg) {
  $('#filmMessages').append("<li>" + msg + "</li>");
  window.scrollTo(0, document.body.scrollHeight);
});

//when the message from general chat is received, it will be appended on client side to an element with id 'seriesMessage'
socket.on('series', function(msg) {
  $('#seriesMessages').append("<li>" + msg + "</li>");
  window.scrollTo(0, document.body.scrollHeight);
});

